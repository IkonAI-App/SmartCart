
"use client";

import type { GroceryItem } from "@/lib/data";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Stats,
  Pagination,
} from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { GroceryItemCard } from "./grocery-item-card";
import { useEffect, useState, useMemo } from "react";

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
    description: hit.content_en,
  };
  return <GroceryItemCard item={item} />;
}

export default function GroceryList() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchClient = useMemo(() => {
    if (typeof window === 'undefined') {
      // Return a dummy client for SSR
      return {
        search: () => Promise.resolve({ results: [] }),
      } as any;
    }
    return algoliasearch("P4TK45JU0B", "79eda3e9b05111a55a3e8fefd859c145");
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background">
              <span className="text-muted-foreground">Loading search...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="products_manual"
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
                <div className="mt-8 flex justify-center">
                    <Pagination
                        classNames={{
                            root: "flex items-center gap-2",
                            list: "flex items-center gap-1",
                            item: "list-none",
                            link: "flex items-center justify-center min-w-[40px] h-10 px-3 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:pointer-events-none disabled:opacity-50",
                            selectedItem: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            disabledItem: "opacity-50 cursor-not-allowed",
                            firstPageItem: "mr-2",
                            previousPageItem: "mr-2",
                            nextPageItem: "ml-2",
                            lastPageItem: "ml-2",
                        }}
                        padding={2}
                        showFirst={true}
                        showLast={true}
                        showPrevious={true}
                        showNext={true}
                        translations={{
                            firstPageItemText: "«",
                            previousPageItemText: "‹",
                            nextPageItemText: "›",
                            lastPageItemText: "»",
                            pageItemText: ({ currentPage, nbPages }) => `${currentPage}`,
                            firstPageItemAriaLabel: "First page",
                            previousPageItemAriaLabel: "Previous page",
                            nextPageItemAriaLabel: "Next page",
                            lastPageItemAriaLabel: "Last page",
                            pageItemAriaLabel: ({ currentPage, nbPages }) => `Page ${currentPage} of ${nbPages}`,
                        }}
                    />
                </div>
            </div>
        </div>
      </div>
    </InstantSearch>
  );
}
