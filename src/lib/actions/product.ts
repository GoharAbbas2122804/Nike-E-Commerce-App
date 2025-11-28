"use server";

import { db } from "@/lib/db";
import { products, productVariants, productImages, brands, categories, reviews, user } from "@/lib/db/schema";
import { and, asc, desc, eq, gte, inArray, like, lte, ne, or, sql } from "drizzle-orm";
import { ProductFilters, parseSortParam, parsePriceRange } from "@/lib/utils/query";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";
import { genders } from "@/lib/db/schema/filters/genders";

export async function getAllProducts(filters: ProductFilters) {
  const { search, category, brand, gender, kids, price, color, size, sort, page, limit } = filters;
  const offset = (page - 1) * limit;

  const sortOptions = parseSortParam(sort);
  const priceRange = parsePriceRange(price);

  const conditions = [];

  // Search
  if (search) {
    conditions.push(or(
      like(products.name, `%${search}%`),
      like(products.description, `%${search}%`)
    ));
  }

  // Category
  if (category) {
    const categorySlugs = category.split(",");
    const categoryIds = await db.select({ id: categories.id }).from(categories).where(inArray(categories.slug, categorySlugs));
    if (categoryIds.length > 0) {
      conditions.push(inArray(products.categoryId, categoryIds.map(c => c.id)));
    }
  }

  // Brand
  if (brand) {
    const brandSlugs = brand.split(",");
    const brandIds = await db.select({ id: brands.id }).from(brands).where(inArray(brands.slug, brandSlugs));
    if (brandIds.length > 0) {
      conditions.push(inArray(products.brandId, brandIds.map(b => b.id)));
    }
  }

  // Gender
  if (gender) {
    const genderSlugs = gender.split(",");
    const genderIds = await db.select({ id: genders.id }).from(genders).where(inArray(genders.slug, genderSlugs));
    if (genderIds.length > 0) {
      conditions.push(inArray(products.genderId, genderIds.map(g => g.id)));
    }
  }

  // Kids
  if (kids) {
     const kidGenders = kids.split(",");
     const genderIds = await db.select({ id: genders.id }).from(genders).where(inArray(genders.slug, kidGenders));
     if (genderIds.length > 0) {
       conditions.push(inArray(products.genderId, genderIds.map(g => g.id)));
     }
  }

  // Price Range
  // Note: Price is on variants, but we filter products that have AT LEAST one variant in range
  // This requires a subquery or join. For simplicity and performance, we'll join variants.
  
  // Color & Size
  // Also on variants.

  const baseQuery = db
    .selectDistinct({
      id: products.id,
      name: products.name,
      description: products.description,
      price: sql<number>`min(${productVariants.price})`.mapWith(Number),
      salePrice: sql<number>`min(${productVariants.salePrice})`.mapWith(Number),
      category: categories.name,
      brand: brands.name,
      gender: genders.label,
      createdAt: products.createdAt,
      image: sql<string>`
        (
          SELECT url FROM ${productImages} 
          WHERE ${productImages.productId} = ${products.id}
          ${color ? sql`AND ${productImages.variantId} IN (SELECT id FROM ${productVariants} WHERE ${productVariants.colorId} IN (SELECT id FROM ${colors} WHERE slug IN (${sql.raw(color.split(',').map(c => `'${c}'`).join(','))})))` : sql`AND ${productImages.isPrimary} = true`}
          LIMIT 1
        )
      `.as('image'),
      colorCount: sql<number>`(SELECT count(distinct ${productVariants.colorId}) FROM ${productVariants} WHERE ${productVariants.productId} = ${products.id})`.mapWith(Number),
    })
    .from(products)
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .where(and(
      eq(products.isPublished, true),
      ...conditions,
      priceRange ? and(gte(productVariants.price, priceRange.min.toString()), lte(productVariants.price, priceRange.max.toString())) : undefined,
      color ? inArray(productVariants.colorId, db.select({ id: colors.id }).from(colors).where(inArray(colors.slug, color.split(",")))) : undefined,
      size ? inArray(productVariants.sizeId, db.select({ id: sizes.id }).from(sizes).where(inArray(sizes.slug, size.split(",")))) : undefined
    ))
    .groupBy(products.id, categories.name, brands.name, genders.label);

  // Sorting
  let orderBy;
  switch (sortOptions.field) {
    case "price":
      orderBy = sortOptions.direction === "asc" ? asc(sql`min(${productVariants.price})`) : desc(sql`min(${productVariants.price})`);
      break;
    case "name":
      orderBy = sortOptions.direction === "asc" ? asc(products.name) : desc(products.name);
      break;
    case "createdAt":
    default:
      orderBy = sortOptions.direction === "asc" ? asc(products.createdAt) : desc(products.createdAt);
      break;
  }

  const data = await baseQuery
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Total Count
  const countQuery = await db
    .select({ count: sql<number>`count(distinct ${products.id})`.mapWith(Number) })
    .from(products)
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(and(
      eq(products.isPublished, true),
      ...conditions,
      priceRange ? and(gte(productVariants.price, priceRange.min.toString()), lte(productVariants.price, priceRange.max.toString())) : undefined,
      color ? inArray(productVariants.colorId, db.select({ id: colors.id }).from(colors).where(inArray(colors.slug, color.split(",")))) : undefined,
      size ? inArray(productVariants.sizeId, db.select({ id: sizes.id }).from(sizes).where(inArray(sizes.slug, size.split(",")))) : undefined
    ));

  const total = countQuery[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

export async function getProduct(id: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      brand: true,
      gender: true,
      variants: {
        with: {
          color: true,
          size: true,
        },
      },
      images: {
        orderBy: asc(productImages.sortOrder),
      },
    },
  });

  if (!product) return null;

  // Group images by variant ID (or 'default' if null)
  const imagesByVariant: Record<string, string[]> = {};
  const defaultImages: string[] = [];

  product.images.forEach((img) => {
    if (img.variantId) {
      if (!imagesByVariant[img.variantId]) {
        imagesByVariant[img.variantId] = [];
      }
      imagesByVariant[img.variantId].push(img.url);
    } else {
      defaultImages.push(img.url);
    }
  });

  // Transform variants to include their specific images + default images as fallback
  const variants = product.variants.map((v) => ({
    ...v,
    images: imagesByVariant[v.id] ? [...imagesByVariant[v.id], ...defaultImages] : defaultImages,
  }));

  return {
    ...product,
    variants,
    defaultImages,
  };
}

export async function getProductReviews(productId: string) {
  const productReviews = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    with: {
      user: true,
    },
    orderBy: desc(reviews.createdAt),
    limit: 10,
  });

  return productReviews.map((review) => ({
    id: review.id,
    author: review.user.name || "Anonymous",
    rating: review.rating,
    title: "", // Schema doesn't have title, using empty string or could be derived
    content: review.comment || "",
    createdAt: review.createdAt.toISOString(),
  }));
}

export async function getRecommendedProducts(productId: string) {
  // Get the current product to find its category/brand
  const currentProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: {
      categoryId: true,
      brandId: true,
    },
  });

  if (!currentProduct) return [];

  // Find products with same category OR brand, excluding current product
  const recommended = await db.query.products.findMany({
    where: and(
      ne(products.id, productId),
      eq(products.isPublished, true),
      or(
        eq(products.categoryId, currentProduct.categoryId),
        eq(products.brandId, currentProduct.brandId)
      )
    ),
    limit: 4,
    with: {
      category: true,
      variants: {
        columns: {
          price: true,
          salePrice: true,
        },
      },
      images: {
        where: eq(productImages.isPrimary, true),
        limit: 1,
      },
    },
  });

  return recommended.map((p) => {
    const minPrice = Math.min(...p.variants.map((v) => Number(v.price)));
    return {
      id: p.id,
      title: p.name,
      category: p.category.name,
      price: minPrice,
      image: p.images[0]?.url || "",
    };
  });
}
