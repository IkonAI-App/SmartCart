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

const getCsvFilePath = () => path.join(process.cwd(), "public/data/grocery-items.csv");

export async function getGroceryItems(): Promise<GroceryItem[]> {
  try {
    const filePath = getCsvFilePath();
    const fileContent = await fs.readFile(filePath, "utf-8");

    const rows = fileContent.trim().split(/\r?\n/);
    if (rows.length <= 1) {
      return [];
    }

    const headers = rows.shift()?.split(",") ?? [];
    
    // Check if it's the user-provided format by looking for 'cprcode'
    if (headers.includes('cprcode')) {
      const cprcodeIndex = headers.indexOf("cprcode");
      const prEngNameIndex = headers.indexOf("pr_engname");
      const categoryIndex = headers.indexOf("online_category_l2_en");
      const priceIndex = headers.indexOf("ba_nprice");
      const inStockIndex = headers.indexOf("pr_active");
      
      return rows.map((row) => {
          const values = row.split(',');
          const id = values[cprcodeIndex]?.trim();
          if (!id) return null;

          return {
            id: id,
            name: values[prEngNameIndex]?.trim() || 'N/A',
            category: values[categoryIndex]?.trim() || 'Uncategorized',
            price: parseFloat(values[priceIndex]) || 0,
            in_stock: values[inStockIndex]?.trim().toLowerCase() === 'true',
            image_seed: id
          };
        })
        .filter((item): item is GroceryItem => item !== null && !!item.id);

    } else { // Fallback to original format
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
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist, which is fine. Return empty array.
      return [];
    }
    console.error("Failed to read grocery items:", error);
    return [];
  }
}

export async function saveGroceryItemsCsv(content: string) {
  try {
    const filePath = getCsvFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");
  } catch (error) {
    console.error("Failed to save CSV file:", error);
    throw new Error("Could not save CSV file.");
  }
}
