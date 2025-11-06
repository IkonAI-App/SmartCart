"use client";

import type { GroceryItem } from "@/lib/data";
import { useState } from "react";
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

interface GroceryItemCardProps {
  item: GroceryItem;
}

export function GroceryItemCard({ item }: GroceryItemCardProps) {
  const category = item.category || "Uncategorized";

  // Extract the 7-digit code from the beginning of the description.
  const match = item.description?.match(/^\d{7}/);
  const imageCode = match ? match[0] : null;
  const paddedCode = imageCode?.padStart(7, "0");

  const primaryUrl = paddedCode
    ? `https://d19oj5aeuefgv.cloudfront.net/${paddedCode}`
    : `https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop`;

  const fallbackUrl = paddedCode
    ? `https://d1vl5j0v241n75.cloudfront.net/${paddedCode}`
    : `https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop`;

  const staticPlaceholderUrl = `https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop`;


  const [imageUrl, setImageUrl] = useState(primaryUrl);

  const handleImageError = () => {
    if (imageUrl === primaryUrl) {
      setImageUrl(fallbackUrl);
    } else if (imageUrl === fallbackUrl) {
      setImageUrl(staticPlaceholderUrl);
    }
    // If the static placeholder also fails, do nothing to prevent an infinite loop.
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
        <div className="w-full h-48 bg-muted flex items-center justify-center relative">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={handleImageError}
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
