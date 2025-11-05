"use client";

import type { GroceryItem } from "@/lib/data";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GroceryItemCard } from "./grocery-item-card";
import { Search } from "lucide-react";

interface GroceryListProps {
  items: GroceryItem[];
  categories: string[];
}

export default function GroceryList({ items, categories }: GroceryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        return selectedCategory ? item.category === selectedCategory : true;
      })
      .filter((item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [items, searchTerm, selectedCategory]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="shrink-0"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> items.
      </div>
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <GroceryItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-lg border-2 border-dashed">
          <p className="text-lg text-muted-foreground">No items found.</p>
          <p className="text-sm text-muted-foreground/80">
            Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
