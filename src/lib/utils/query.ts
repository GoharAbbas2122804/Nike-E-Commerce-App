import qs from 'query-string';

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

import { z } from "zod";

export const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  gender: z.string().optional(),
  kids: z.string().optional(),
  price: z.string().optional(), // Format: "min-max"
  color: z.string().optional(),
  size: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
});

export type ProductFilters = z.infer<typeof filterSchema>;

export interface SortOptions {
  field: "price" | "createdAt" | "name";
  direction: "asc" | "desc";
}

export function parseFilterParams(params: Record<string, string | string[] | undefined>): ProductFilters {
  const parsed = {
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    brand: typeof params.brand === "string" ? params.brand : undefined,
    gender: typeof params.gender === "string" ? params.gender : undefined,
    kids: typeof params.kids === "string" ? params.kids : undefined,
    price: typeof params.price === "string" ? params.price : undefined,
    color: typeof params.color === "string" ? params.color : undefined,
    size: typeof params.size === "string" ? params.size : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    page: params.page,
    limit: params.limit,
  };

  const result = filterSchema.safeParse(parsed);

  if (!result.success) {
    console.error("Invalid filter params:", result.error);
    return { page: 1, limit: 12 };
  }

  return result.data;
}

export function parseSortParam(sortParam?: string): SortOptions {
  if (!sortParam) return { field: "createdAt", direction: "desc" };

  switch (sortParam) {
    case "price-asc":
      return { field: "price", direction: "asc" };
    case "price-desc":
      return { field: "price", direction: "desc" };
    case "newest":
      return { field: "createdAt", direction: "desc" };
    case "name-asc":
      return { field: "name", direction: "asc" };
    case "name-desc":
      return { field: "name", direction: "desc" };
    default:
      return { field: "createdAt", direction: "desc" };
  }
}

export function parsePriceRange(priceParam?: string): { min: number; max: number } | undefined {
  if (!priceParam) return undefined;
  
  const parts = priceParam.split("-").map(Number);
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return undefined;
  
  return { min: parts[0], max: parts[1] };
}
