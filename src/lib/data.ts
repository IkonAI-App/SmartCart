import fs from "fs/promises";
import path from "path";

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  image_seed: string;
}

export async function getGroceryItems(): Promise<GroceryItem[]> {
  try {
    const filePath = path.join(process.cwd(), "public/data/grocery-items.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");

    const rows = fileContent.trim().split("\n");
    if (rows.length <= 1) {
      return [];
    }

    const headers = rows.shift()?.split(",") ?? [];
    const idIndex = headers.indexOf("id");
    const nameIndex = headers.indexOf("name");
    const categoryIndex = headers.indexOf("category");
    const priceIndex = headers.indexOf("price");
    const inStockIndex = headers.indexOf("in_stock");
    const imageSeedIndex = headers.indexOf("image_seed");

    return rows
      .map((row) => {
        const values = row.split(",");
        if (values.length !== headers.length) {
          return null;
        }

        const price = parseFloat(values[priceIndex]);

        return {
          id: values[idIndex]?.trim(),
          name: values[nameIndex]?.trim(),
          category: values[categoryIndex]?.trim(),
          price: isNaN(price) ? 0 : price,
          in_stock: values[inStockIndex]?.trim().toLowerCase() === "true",
          image_seed: values[imageSeedIndex]?.trim(),
        };
      })
      .filter((item): item is GroceryItem => item !== null && !!item.id);
  } catch (error) {
    console.error("Failed to read grocery items:", error);
    return [];
  }
}
