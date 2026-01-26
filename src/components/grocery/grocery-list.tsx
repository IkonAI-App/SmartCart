
"use client";

import type { GroceryItem } from "@/lib/data";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Stats,
  Pagination,
  useSearchBox,
} from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { GroceryItemCard } from "./grocery-item-card";
import { useEffect, useState, useMemo } from "react";

function Hit({ hit }: { hit: any }) {
  // The hit object from Algolia might have a different structure.
  // We need to map it to what GroceryItemCard expects.
  // We also need to handle the fact that Algolia might return highlighted snippets.
  
  // Helper to extract plain text from potentially highlighted Algolia results
  const getPlainText = (value: any): string | undefined => {
    if (!value) return undefined;
    
    // Handle Algolia highlight result objects (e.g., { value: "...", matchLevel: "..." })
    if (typeof value === 'object' && value !== null && 'value' in value) {
      value = value.value;
    }
    
    if (typeof value === 'string') {
      // Remove HTML tags (from Algolia highlighting) and trim
      const cleaned = value.replace(/<[^>]*>/g, '').trim();
      return cleaned || undefined;
    }
    
    const str = String(value).trim();
    return str || undefined;
  };

  // Try multiple fields for product name (fallback chain)
  const productName = 
    getPlainText(hit.pr_engname) || 
    getPlainText(hit._highlightResult?.pr_engname?.value) ||
    getPlainText(hit.pr_online_name_en) ||
    getPlainText(hit.hema_name_en) ||
    getPlainText(hit.pr_name_en);

  // Try multiple fields for Thai name (fallback chain)
  const productNameThai = 
    getPlainText(hit.pr_name_th) ||
    getPlainText(hit.pr_online_name_th) ||
    getPlainText(hit.hema_name_th);

  // Try multiple fields for brand (fallback chain)
  const brand = 
    getPlainText(hit.hema_brand_en) ||
    getPlainText(hit.pr_brand_en) ||
    getPlainText(hit.hema_brand_th) ||
    getPlainText(hit.pr_brand_th);

  // Get category levels
  const categoryL1 = 
    getPlainText(hit.online_category_l1_en) || 
    getPlainText(hit._highlightResult?.online_category_l1_en?.value) ||
    getPlainText(hit.villa_category_l1_en);
  
  const categoryL2 = getPlainText(hit.online_category_l2_en);
  const categoryL3 = getPlainText(hit.online_category_l3_en);

  // Use L1 as the main category for backwards compatibility
  const category = categoryL1 || '';

  const item: GroceryItem = {
    id: hit.objectID as string,
    name: productName || '',
    nameThai: productNameThai,
    category: category,
    categoryL1: categoryL1,
    categoryL2: categoryL2,
    categoryL3: categoryL3,
    brand: brand,
    price: parseFloat(hit.ba_nprice) || 0,
    in_stock: hit.pr_active === 'True' || hit.pr_active === true,
    description: getPlainText(hit.content_en) || getPlainText(hit._highlightResult?.content_en?.value) || '',
    sku: hit.cprcode ? String(hit.cprcode).padStart(7, '0') : undefined,
  };
  return <GroceryItemCard item={item} />;
}

// Component to conditionally show results only when there's a query
function SearchResults() {
  const { query } = useSearchBox();
  
  // Don't show anything if there's no query
  if (!query || query.trim() === '') {
    return null;
  }
  
  return (
    <>
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
    </>
  );
}

// Component to conditionally show categories only when there's a query
function CategoryFilters() {
  const { query } = useSearchBox();
  
  // Don't show categories if there's no query
  if (!query || query.trim() === '') {
    return null;
  }
  
  return (
    <>
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
    </>
  );
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
                <CategoryFilters />
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
                <SearchResults />
            </div>
        </div>
      </div>
    </InstantSearch>
  );
}
