"use client";

import type { GroceryItem } from "@/lib/data";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Stats,
} from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { GroceryItemCard } from "./grocery-item-card";

const searchClient = algoliasearch(
  "P4TK45JU0B",
  "79eda3e9b05111a55a3e8fefd859c145"
);

function Hit({ hit }: { hit: any }) {
  // The hit object from Algolia might have a different structure.
  // We need to map it to what GroceryItemCard expects.
  // We also need to handle the fact that Algolia might return highlighted snippets.
  const item: GroceryItem = {
    id: hit.objectID as string,
    name: hit.pr_engname,
    category: hit.online_category_l1_en,
    price: parseFloat(hit.ba_nprice) || 0,
    in_stock: hit.pr_active === 'True' || hit.pr_active === true,
    image_seed: hit.cprcode,
    description: hit.content_en,
  };
  return <GroceryItemCard item={item} />;
}

export default function GroceryList({
  items,
  categories,
}: {
  items: any[];
  categories: string[];
}) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="products_manual"
      insights
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
             <SearchBox
                placeholder="Search for items..."
                className="w-full"
                classNames={{
                  root: 'w-full',
                  form: 'w-full',
                  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  submitIcon: 'hidden',
                  resetIcon: 'hidden',
                }}
             />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
                <h3 className="font-bold mb-2">Category</h3>
                <RefinementList 
                    attribute="online_category_l1_en"
                    classNames={{
                        list: 'space-y-2',
                        label: 'flex items-center space-x-2',
                        checkbox: 'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
                        labelText: 'text-sm',
                        count: 'ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground',
                    }}
                />
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
                <div className="text-sm text-muted-foreground mb-4">
                    <Stats />
                </div>
                <Hits
                    hitComponent={Hit}
                    classNames={{
                        list: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6",
                        item: "list-none",
                    }}
                />
            </div>
        </div>
      </div>
    </InstantSearch>
  );
}
