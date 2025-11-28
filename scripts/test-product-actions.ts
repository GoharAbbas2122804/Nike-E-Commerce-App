import dotenv from "dotenv";
import path from "path";

// Load env vars before importing modules that use them
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const { getAllProducts, getProduct } = await import("../src/lib/actions/product");
  const { parseFilterParams } = await import("../src/lib/utils/query");

  console.log("Testing getAllProducts...");
  const filters = parseFilterParams({ limit: "5" });
  const result = await getAllProducts(filters);
  console.log("getAllProducts result:", JSON.stringify(result, null, 2));

  if (result.data.length > 0) {
    const productId = result.data[0].id;
    console.log(`Testing getProduct for ID: ${productId}...`);
    const product = await getProduct(productId);
    console.log("getProduct result:", JSON.stringify(product, null, 2));
  } else {
    console.log("No products found to test getProduct.");
  }
}

main().catch(console.error);
