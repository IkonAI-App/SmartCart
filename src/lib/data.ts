import fs from 'fs/promises';
import path from 'path';
import { generatePlaceholderImages } from './placeholder-images-generator';
import { parse } from 'csv-parse/sync';
import algoliasearch from 'algoliasearch';

// Initialize Algolia client
const algoliaClient = algoliasearch('P4TK45JU0B', process.env.ALGOLIA_ADMIN_KEY || '');
const algoliaIndex = algoliaClient.initIndex('products_manual');

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  image_seed: string;
  description: string;
}

const getCsvFilePath = () =>
  path.join(process.cwd(), 'public/data/grocery-items.csv');
const getPlaceholderJsonPath = () =>
  path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');


export async function parseAndSaveGroceryItems(csvContent: string) {
  await saveGroceryItemsCsv(csvContent);
  const items = await parseGroceryItems(csvContent);
  await indexGroceryItems(items);
  // This will now only generate if the file doesn't exist or is empty
  await getOrGeneratePlaceholderImages(items); 
  return items;
}

async function getOrGeneratePlaceholderImages(items: GroceryItem[]) {
  try {
    // Check if the file exists and is not empty
    const stats = await fs.stat(getPlaceholderJsonPath());
    if (stats.size > 0) {
      return;
    }
  } catch (error: any) {
    // If file does not exist, that's fine, we'll generate it.
    if (error.code !== 'ENOENT') {
      console.error("Error checking placeholder images file:", error);
      // Don't block the main operation if this check fails
      return;
    }
  }
  // File doesn't exist or is empty, so generate it.
  await generatePlaceholderImages(items);
}

export async function parseGroceryItems(
  fileContent: string
): Promise<any[]> {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    cast: true,
  });

  if (!records || records.length === 0) {
    return [];
  }
  
  const items = records
    .map((record: any, index: number) => {
      
      if (!record.cprcode) return null;

      return {
        objectID: record.cprcode?.trim(),
        ...record
       };
    })
    .filter((item: any): item is any => item !== null);

  return items;
}

export async function getGroceryItems(): Promise<GroceryItem[]> {
  try {
    const filePath = getCsvFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    if (!fileContent) {
      return [];
    }
    const items = await parseGroceryItems(fileContent);
    // Map to the GroceryItem interface for components that still use it.
    const groceryItems = items.map((item: any) => ({
      id: item.cprcode,
      name: item.pr_engname || 'N/A',
      category: item.online_category_l1_en || 'Uncategorized',
      price: parseFloat(item.ba_nprice) || 0,
      in_stock: item.pr_active === 'True',
      image_seed: item.cprcode || `seed-${item.objectID}`,
      description: item.content_en || '',
    }));
    await getOrGeneratePlaceholderImages(groceryItems);
    return groceryItems;
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
    // Also clear the placeholder file to force regeneration
    await fs.writeFile(getPlaceholderJsonPath(), '', 'utf-8');
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Failed to save CSV file or clear placeholders:', error);
    throw new Error('Could not save CSV file.');
  }
}

export async function indexGroceryItems(items: any[]) {
    if (!process.env.ALGOLIA_ADMIN_KEY) {
        console.warn("Algolia Admin Key not found. Skipping indexing.");
        return;
    }
    if (items.length === 0) {
        return;
    }

    try {
        await algoliaIndex.clearObjects();
        await algoliaIndex.saveObjects(items);
        console.log(`Successfully indexed ${items.length} items to Algolia.`);
    } catch (error) {
        console.error("Error indexing to Algolia:", error);
        throw new Error("Failed to index data to Algolia.");
    }
}