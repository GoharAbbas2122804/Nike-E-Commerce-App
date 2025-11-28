"use server";

import { auth } from "../auth";
import { db } from "../db";
import { guest } from "../db/schema";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUp(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = signUpSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (result) {
      await mergeGuestCartWithUserCart();
      return { success: true };
    }
    return { error: { root: ["Failed to sign up"] } };
  } catch (error: any) {
    return { error: { root: [error.message || "Something went wrong"] } };
  }
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = signInSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (result) {
      await mergeGuestCartWithUserCart();
      return { success: true };
    }
    return { error: { root: ["Invalid email or password"] } };
  } catch (error: any) {
    return { error: { root: [error.message || "Something went wrong"] } };
  }
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
}

export async function createGuestSession() {
  const sessionToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  await db.insert(guest).values({
    sessionToken,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("guest_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  return sessionToken;
}

export async function guestSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("guest_session")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db.query.guest.findFirst({
    where: eq(guest.sessionToken, sessionToken),
  });

  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return session;
}

export async function mergeGuestCartWithUserCart() {
  const guestSessionData = await guestSession();
  if (!guestSessionData) {
    return;
  }

  // Placeholder for merging cart logic
  console.log("Merging guest cart with user cart for session:", guestSessionData.sessionToken);

  // Remove guest session cookie and DB record
  const cookieStore = await cookies();
  cookieStore.delete("guest_session");
  
  await db.delete(guest).where(eq(guest.sessionToken, guestSessionData.sessionToken));
}
