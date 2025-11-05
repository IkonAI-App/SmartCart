
import fs from 'fs/promises';
import path from 'path';
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
  description: string;
}

const getCsvFilePath = () =>
  path.join(process.cwd(), 'public/data/grocery-items.csv');

export async function parseAndSaveGroceryItems(csvContent: string) {
  await saveGroceryItemsCsv(csvContent);
  const items = await parseGroceryItems(csvContent);
  await indexGroceryItems(items);
  return items;
}

export async function parseGroceryItems(
  fileContent: string
): Promise<any[]> {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  if (!records || records.length === 0) {
    return [];
  }
  
  const items = records
    .map((record: any, index: number) => {
      
      const objectID = String(record.cprcode || index).trim();
      if (!objectID) return null;

      return {
        objectID: objectID,
        ...record
       };
    })
    .filter((item: any): item is any => item !== null);

  return items;
}

export async function getGroceryItems(): Promise<GroceryItem[]> {
  // This function is no longer the primary source of truth for the list component,
  // but can be used for other purposes if needed.
  try {
    const filePath = getCsvFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    if (!fileContent) {
      return [];
    }
    const items = await parseGroceryItems(fileContent);
    // Map to the GroceryItem interface.
    const groceryItems: GroceryItem[] = items.map((item: any) => ({
      id: item.objectID,
      name: item.pr_engname || 'N/A',
      category: item.online_category_l1_en || 'Uncategorized',
      price: parseFloat(item.ba_nprice) || 0,
      in_stock: item.pr_active === 'True',
      description: item.content_en || '',
    }));
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
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Failed to save CSV file:', error);
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
        // Clear existing objects before saving new ones
        await algoliaIndex.clearObjects();
        const { taskID } = await algoliaIndex.saveObjects(items, {
            autoGenerateObjectIDIfNotExist: false
        });
        await algoliaIndex.waitTask(taskID);
        console.log(`Successfully indexed ${items.length} items to Algolia.`);
    } catch (error) {
        console.error("Error indexing to Algolia:", error);
        throw new Error("Failed to index data to Algolia.");
    }
}
