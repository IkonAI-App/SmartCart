import fs from 'fs/promises';
import path from 'path';
import { generatePlaceholderImages } from './placeholder-images-generator';
import { parse } from 'csv-parse/sync';

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  image_seed: string;
}

const getCsvFilePath = () =>
  path.join(process.cwd(), 'public/data/grocery-items.csv');

export async function parseAndSaveGroceryItems(csvContent: string) {
  await saveGroceryItemsCsv(csvContent);
  const items = await parseGroceryItems(csvContent);
  await generatePlaceholderImages(items);
  return items;
}

export async function parseGroceryItems(
  fileContent: string
): Promise<GroceryItem[]> {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const headers = Object.keys(records[0] || {});
  
  if (headers.includes('cprcode')) {
     const items = records.map((record: any) => {
        const id = record.cprcode?.trim();
        if (!id) return null;

        return {
          id: id,
          name: record.pr_engname?.trim().replace(/"/g, '') || 'N/A',
          category: record.online_category_l2_en?.trim().replace(/"/g, '') || 'Uncategorized',
          price: parseFloat(record.ba_nprice) || 0,
          in_stock: record.pr_active?.trim().toLowerCase() === 'true',
          image_seed: id,
        };
      })
      .filter((item: any): item is GroceryItem => item !== null && !!item.id);
      return items;
  } else { // Fallback to original format
      const items = records.map((record: any) => {
        const id = record.id?.trim();
        if(!id) return null;

        const price = parseFloat(record.price);
        return {
          id: id,
          name: record.name?.trim() || 'N/A',
          category: record.category?.trim() || 'Uncategorized',
          price: isNaN(price) ? 0 : price,
          in_stock: record.in_stock?.trim().toLowerCase() === 'true',
          image_seed: record.image_seed?.trim() || id,
        };
      })
      .filter((item: any): item is GroceryItem => item !== null && !!item.id);
    return items;
  }
}


export async function getGroceryItems(): Promise<GroceryItem[]> {
  try {
    const filePath = getCsvFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const items = await parseGroceryItems(fileContent);
    await generatePlaceholderImages(items);
    return items;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist, which is fine. Return empty array.
      return [];
    }
    console.error('Failed to read grocery items:', error);
    return [];
  }
}

export async function saveGroceryItemsCsv(content: string) {
  try {
    const filePath = getCsvFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Failed to save CSV file:', error);
    throw new Error('Could not save CSV file.');
  }
}
