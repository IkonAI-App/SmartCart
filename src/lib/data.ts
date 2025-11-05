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
const getPlaceholderJsonPath = () =>
  path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');


export async function parseAndSaveGroceryItems(csvContent: string) {
  await saveGroceryItemsCsv(csvContent);
  const items = await parseGroceryItems(csvContent);
  // This will now only generate if the file doesn't exist or is empty
  await getOrGeneratePlaceholderImages(items); 
  return items;
}

async function getOrGeneratePlaceholderImages(items: GroceryItem[]) {
  try {
    await fs.access(getPlaceholderJsonPath());
    // File exists, do nothing.
  } catch {
    // File doesn't exist, generate it.
    await generatePlaceholderImages(items);
  }
}

export async function parseGroceryItems(
  fileContent: string
): Promise<GroceryItem[]> {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (!records || records.length === 0) {
    return [];
  }
  
  const headers = Object.keys(records[0]);
  const hasCprCode = headers.includes('cprcode');

  const items = records
    .map((record: any) => {
      let id: string;
      let name: string;
      let category: string;
      let price: number;
      let in_stock: boolean;
      let image_seed: string;

      if (hasCprCode) {
        id = record.cprcode?.trim();
        name = record.pr_engname?.trim().replace(/"/g, '') || 'N/A';
        category = record.online_category_l2_en?.trim().replace(/"/g, '') || 'Uncategorized';
        price = parseFloat(record.ba_nprice) || 0;
        in_stock = record.pr_active?.trim().toLowerCase() === 'true';
        image_seed = id;
      } else {
        id = record.id?.trim();
        name = record.name?.trim() || 'N/A';
        category = record.category?.trim() || 'Uncategorized';
        const parsedPrice = parseFloat(record.price);
        price = isNaN(parsedPrice) ? 0 : parsedPrice;
        in_stock = record.in_stock?.trim().toLowerCase() === 'true';
        image_seed = record.image_seed?.trim() || id;
      }
      
      if (!id) return null;

      return { id, name, category, price, in_stock, image_seed };
    })
    .filter((item: any): item is GroceryItem => item !== null);

  return items;
}


export async function getGroceryItems(): Promise<GroceryItem[]> {
  try {
    const filePath = getCsvFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const items = await parseGroceryItems(fileContent);
    await getOrGeneratePlaceholderImages(items);
    return items;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
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
