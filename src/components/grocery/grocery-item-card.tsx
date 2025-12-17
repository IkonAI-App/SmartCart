"use client";

import type { GroceryItem } from "@/lib/data";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { CategoryIcon } from "./category-icon";
import Image from "next/image";
import { generateDynamicPlaceholder } from "@/lib/placeholder-utils";

interface GroceryItemCardProps {
  item: GroceryItem;
}

export function GroceryItemCard({ item }: GroceryItemCardProps) {
  const category = item.category || "Uncategorized";

  // Extract the 7-digit code from the beginning of the description.
  const match = item.description?.match(/^\d{7}/);
  const imageCode = match ? match[0] : null;
  const paddedCode = imageCode?.padStart(7, "0");

  // Generate dynamic placeholder once (deterministic based on item name/category)
  // This is an SVG data URL that loads instantly without any network request
  const dynamicPlaceholderUrl = generateDynamicPlaceholder(item.name, category, 400, 300);

  const primaryUrl = paddedCode
    ? `https://d19oj5aeuefgv.cloudfront.net/${paddedCode}`
    : null;

  const fallbackUrl = paddedCode
    ? `https://d1vl5j0v241n75.cloudfront.net/${paddedCode}`
    : null;

  // Start with dynamic placeholder immediately - it loads instantly
  // If we have CloudFront URLs, we'll try them but fallback quickly on error
  const [imageUrl, setImageUrl] = useState(dynamicPlaceholderUrl);
  const attemptedRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current URL is a data URL (SVG placeholder)
  const isDataUrl = imageUrl?.startsWith("data:");

  // Try to load CloudFront images if available, but don't block on them
  useEffect(() => {
    // Only try CloudFront URLs if we have them and haven't tried them yet
    if (!primaryUrl || attemptedRef.current.has(primaryUrl)) return;

    // Set a timeout to ensure we don't wait too long
    const timeout = setTimeout(() => {
      // If timeout expires, mark as attempted and ensure placeholder is shown
      attemptedRef.current.add(primaryUrl);
      if (fallbackUrl) attemptedRef.current.add(fallbackUrl);
      setImageUrl((current) => {
        // Only reset to placeholder if we're still trying to load CloudFront
        if (current !== dynamicPlaceholderUrl && !current?.startsWith('data:')) {
          return dynamicPlaceholderUrl;
        }
        return current;
      });
    }, 1500); // 1.5 second timeout - fail fast

    // Try primary URL with better error handling
    const img = new window.Image();
    let loaded = false;
    
    img.onload = () => {
      if (!loaded) {
        loaded = true;
        clearTimeout(timeout);
        setImageUrl(primaryUrl);
        attemptedRef.current.add(primaryUrl);
      }
    };
    
    img.onerror = () => {
      if (!loaded) {
        loaded = true;
        clearTimeout(timeout);
        attemptedRef.current.add(primaryUrl);
        // Try fallback if primary fails
        if (fallbackUrl && !attemptedRef.current.has(fallbackUrl)) {
          const fallbackImg = new window.Image();
          let fallbackLoaded = false;
          
          fallbackImg.onload = () => {
            if (!fallbackLoaded) {
              fallbackLoaded = true;
              setImageUrl(fallbackUrl);
              attemptedRef.current.add(fallbackUrl);
            }
          };
          
          fallbackImg.onerror = () => {
            if (!fallbackLoaded) {
              fallbackLoaded = true;
              attemptedRef.current.add(fallbackUrl);
              // Ensure we're using dynamic placeholder
              setImageUrl(dynamicPlaceholderUrl);
            }
          };
          
          fallbackImg.src = fallbackUrl;
        } else {
          // No fallback or already tried - ensure dynamic placeholder
          setImageUrl(dynamicPlaceholderUrl);
        }
      }
    };
    
    img.src = primaryUrl;

    return () => {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };
  }, [primaryUrl, fallbackUrl, dynamicPlaceholderUrl]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Immediately fallback to dynamic placeholder on any error
    // This prevents broken image icons from showing
    e.preventDefault();
    e.stopPropagation();
    setImageUrl(dynamicPlaceholderUrl);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Badge
          className="absolute top-2 right-2 z-10"
          style={
            item.in_stock
              ? {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }
              : {
                  backgroundColor: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive-foreground))",
                }
          }
        >
          {item.in_stock ? "In Stock" : "Out of Stock"}
        </Badge>
        <div className="w-full h-48 bg-muted flex items-center justify-center relative overflow-hidden">
          <Image
            key={imageUrl} // Force re-render when URL changes
            src={imageUrl || dynamicPlaceholderUrl}
            alt={item.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={handleImageError}
            onLoadingComplete={(img) => {
              // Verify image actually loaded - if not, use placeholder
              if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
                setImageUrl(dynamicPlaceholderUrl);
              }
            }}
            unoptimized={isDataUrl}
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-headline leading-tight">
            {item.name}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 ml-2">
            <CategoryIcon category={category} className="h-4 w-4" />
            <span className="truncate">{category}</span>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {/* We display the description without the code */}
          {item.description?.replace(/^\d{7}\s*/, "")}
        </CardDescription>
        <div className="flex-grow"></div>
        <p className="text-2xl font-bold font-sans text-primary mt-2">
          ฿{Number(item.price)?.toFixed(2) || "0.00"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={!item.in_stock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
