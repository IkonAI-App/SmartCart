
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
  // The hit object from Algolia has fields prefixed with "data."
  // We need to map it to what GroceryItemCard expects.
  // We also need to handle the fact that Algolia might return highlighted snippets.
  
  // Debug: Log the hit structure to understand the data format
  // console.log('Hit structure:', hit);
  
  // Helper to extract plain text from potentially highlighted Algolia results
  const getPlainText = (value: any): string | undefined => {
    if (!value) return undefined;
    
    // Handle Algolia highlight result objects (e.g., { value: "...", matchLevel: "..." })
    if (typeof value === 'object' && value !== null && 'value' in value) {
      value = value.value;
    }
    
    if (typeof value === 'string') {
      // Remove HTML tags and Algolia highlight tags (__ais-highlight__...__/ais-highlight__)
      const cleaned = value
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/__ais-highlight__/g, '') // Remove highlight start tags
        .replace(/__\/ais-highlight__/g, '') // Remove highlight end tags
        .trim();
      return cleaned || undefined;
    }
    
    const str = String(value).trim();
    return str || undefined;
  };

  // Helper to get field value, checking both data.* prefix and root level
  const getField = (fieldName: string): any => {
    // First check if there's a nested data object
    if (hit.data && typeof hit.data === 'object' && fieldName in hit.data) {
      return hit.data[fieldName];
    }
    // Check for flat structure with "data." prefix (e.g., "data.online_category_l1_en")
    const flatKey = `data.${fieldName}`;
    if (flatKey in hit) {
      return hit[flatKey];
    }
    // Fallback to root level
    return hit[fieldName];
  };

  // Helper to get highlighted field value
  const getHighlightedField = (fieldName: string): any => {
    // First check if there's a nested data object
    if (hit._highlightResult?.data && typeof hit._highlightResult.data === 'object' && fieldName in hit._highlightResult.data) {
      return hit._highlightResult.data[fieldName];
    }
    // Check for flat structure with "data." prefix
    const flatKey = `data.${fieldName}`;
    if (hit._highlightResult && flatKey in hit._highlightResult) {
      return hit._highlightResult[flatKey];
    }
    // Fallback to root level
    return hit._highlightResult?.[fieldName];
  };

  // Try multiple fields for product name (fallback chain)
  const productName = 
    getPlainText(getHighlightedField('pr_engname')?.value) ||
    getPlainText(getField('pr_engname')) || 
    getPlainText(getField('pr_online_name_en')) ||
    getPlainText(getField('hema_name_en')) ||
    getPlainText(getField('pr_name_en'));

  // Try multiple fields for Thai name (fallback chain)
  const productNameThai = 
    getPlainText(getField('pr_name_th')) ||
    getPlainText(getField('pr_online_name_th')) ||
    getPlainText(getField('hema_name_th'));

  // Try multiple fields for brand (fallback chain)
  const brand = 
    getPlainText(getField('hema_brand_en')) ||
    getPlainText(getField('pr_brand_en')) ||
    getPlainText(getField('hema_brand_th')) ||
    getPlainText(getField('pr_brand_th'));

  // Get category levels
  const categoryL1 = 
    getPlainText(getHighlightedField('online_category_l1_en')?.value) ||
    getPlainText(getField('online_category_l1_en')) || 
    getPlainText(getField('villa_category_l1_en'));
  
  const categoryL2 = getPlainText(getField('online_category_l2_en'));
  const categoryL3 = getPlainText(getField('online_category_l3_en'));

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
    price: parseFloat(getField('ba_nprice') || '0') || 0,
    in_stock: getField('pr_active') === 'True' || getField('pr_active') === 'true' || getField('pr_active') === true,
    description: getPlainText(getHighlightedField('content_en')?.value) || getPlainText(getField('content_en')) || '',
    sku: hit.cprcode || getField('cprcode') ? String(hit.cprcode || getField('cprcode')).padStart(7, '0') : undefined,
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
    return algoliasearch("P4TK45JU0B", "64184577655ffed78204541f0519f7cd");
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
      indexName="Villa_online_products"
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
