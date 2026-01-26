"use client";

import type { GroceryItem } from "@/lib/data";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface GroceryItemCardProps {
  item: GroceryItem;
}

type ImageVariant = "" | "-1";

/**
 * Generates a thumbnail image URL
 */
function getThumbnailUrl(sku: string, variant: ImageVariant = ""): string {
  return `https://d1vl5j0v241n75.cloudfront.net/${sku}${variant}`;
}

/**
 * Generates a full-size image URL
 */
function getFullSizeUrl(sku: string, variant: ImageVariant = ""): string {
  return `https://d19oj5aeuefgv.cloudfront.net/${sku}${variant}`;
}

/**
 * Extracts and pads SKU to 7 digits from item description
 */
function extractSKU(description?: string): string | null {
  const match = description?.match(/^\d{7}/);
  if (!match) return null;
  return match[0].padStart(7, "0");
}

/**
 * Gets emoji for a category based on category name - semantically related to the concept
 */
function getCategoryEmoji(category: string): string {
  const lower = category.toLowerCase();
  
  // Snacks & Confectionery - snack-related emoji
  if (lower.includes('snack') || lower.includes('crisp') || lower.includes('chip') || 
      lower.includes('corn chip')) {
    return '🥨'; // Pretzel/snack
  }
  
  // Confectionery - sweets/candy
  if (lower.includes('candy') || lower.includes('chocolate') || lower.includes('confectionery')) {
    return '🍬'; // Candy
  }
  
  // Delicatessen - prepared foods
  if (lower.includes('delicatessen') || lower.includes('deli') || lower.includes('prepared')) {
    return '🥗'; // Salad/prepared food
  }
  
  // Grocery - general grocery items
  if (lower.includes('grocery')) {
    return '🥫'; // Canned goods
  }
  
  // Frozen Food
  if (lower.includes('frozen')) {
    return '🧊'; // Ice cube (frozen)
  }
  
  // Beer Wine & Spirits
  if (lower.includes('beer')) {
    return '🍺'; // Beer
  }
  if (lower.includes('wine')) {
    return '🍷'; // Wine
  }
  if (lower.includes('spirit') || lower.includes('alcohol')) {
    return '🥃'; // Spirits
  }
  
  // Fresh Produce - vegetables/fruits
  if (lower.includes('fresh') || lower.includes('produce') || lower.includes('vegetable') || 
      lower.includes('fruit')) {
    return '🥬'; // Leafy greens
  }
  
  // Cooking & Sauces
  if (lower.includes('cooking') || lower.includes('sauce') || lower.includes('gravy') || 
      lower.includes('seasoning')) {
    return '🧂'; // Salt/seasoning
  }
  
  // Noodles & Pasta
  if (lower.includes('noodle') || lower.includes('pasta')) {
    return '🍝'; // Spaghetti
  }
  
  // Asian Deli
  if (lower.includes('asian') || lower.includes('deli')) {
    return '🍱'; // Bento box
  }
  
  // Eggs
  if (lower.includes('egg')) {
    return '🥚'; // Egg
  }
  
  // Dairy
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese')) {
    return '🥛'; // Milk
  }
  
  // Meat
  if (lower.includes('meat') || lower.includes('beef') || lower.includes('pork') || 
      lower.includes('chicken')) {
    return '🥩'; // Meat
  }
  
  // Seafood
  if (lower.includes('seafood') || lower.includes('fish')) {
    return '🐟'; // Fish
  }
  
  // Bakery
  if (lower.includes('bakery') || lower.includes('bread')) {
    return '🍞'; // Bread
  }
  
  // Default - package/box
  return '📦';
}

/**
 * Gets emoji for a brand - semantically related to the brand's product type
 */
function getBrandEmoji(brand: string): string {
  const lower = brand.toLowerCase();
  
  // Takis - spicy chips/snacks
  if (lower.includes('takis')) {
    return '🔥'; // Fire (spicy)
  }
  
  // Moku - konjac/noodles
  if (lower.includes('moku')) {
    return '🍜'; // Noodles
  }
  
  // Bumil - Korean sauce/condiment
  if (lower.includes('bumil')) {
    return '🌶️'; // Hot pepper (Korean/spicy)
  }
  
  // Generic food brands - try to infer from common patterns
  if (lower.includes('brand') || lower.includes('label')) {
    return '🏷️'; // Label tag
  }
  
  // Default brand emoji - shopping tag
  return '🏷️';
}

export function GroceryItemCard({ item }: GroceryItemCardProps) {
  const category = item.category || "Uncategorized";
  const itemName = item.name || "Grocery Item";
  const imageAlt = itemName || category || "Grocery item image";

  // Use sku from item if available, otherwise try to extract from description
  const sku = item.sku 
    ? item.sku.padStart(7, "0") 
    : extractSKU(item.description);
  
  // Thumbnail state: error flag and current variant
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailVariant, setThumbnailVariant] = useState<ImageVariant>("");
  
  // Full image state: error flag and current variant
  const [fullImageError, setFullImageError] = useState(false);
  const [fullImageVariant, setFullImageVariant] = useState<ImageVariant>("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current thumbnail URL
  const thumbnailUrl = sku ? getThumbnailUrl(sku, thumbnailVariant) : null;
  
  // Get current full-size URL
  const fullImageUrl = sku ? getFullSizeUrl(sku, fullImageVariant) : null;

  // Handle thumbnail image error - try variant fallback
  const handleThumbnailError = () => {
    if (thumbnailVariant === "") {
      // Try -1 variant
      setThumbnailVariant("-1");
    } else {
      // Both variants failed, show placeholder
      setThumbnailError(true);
    }
  };

  // Handle full image error - try variant fallback
  const handleFullImageError = () => {
    if (fullImageVariant === "") {
      // Try -1 variant
      setFullImageVariant("-1");
    } else {
      // Both variants failed, show placeholder
      setFullImageError(true);
    }
  };

  // Reset full image state when modal opens
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (open) {
      // Reset full image state when opening modal
      setFullImageError(false);
      setFullImageVariant("");
    }
  };

  // Show placeholder icon if all images failed
  const showThumbnailPlaceholder = !sku || thumbnailError;
  const showFullImagePlaceholder = !sku || fullImageError;

  return (
    <>
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
          <div 
            className="w-full aspect-square bg-muted flex items-center justify-center relative overflow-hidden cursor-pointer group"
            onClick={() => handleModalOpenChange(true)}
          >
            {showThumbnailPlaceholder ? (
              <div className="flex items-center justify-center w-full h-full">
                <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-50" />
              </div>
            ) : (
              <Image
                key={thumbnailUrl} // Force re-render when URL changes
                src={thumbnailUrl!}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={handleThumbnailError}
                unoptimized
                priority={false}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col gap-2">
            {/* Product Name - Bold and prominent */}
            <CardTitle className="text-base font-semibold leading-tight text-foreground">
              {itemName}
            </CardTitle>
            
            {/* Thai translation - Directly under the name */}
            {item.nameThai && (
              <p className="text-[10px] text-muted-foreground/75 leading-relaxed -mt-1">
                {item.nameThai}
              </p>
            )}
            
            {/* Categories - Styled better with emojis and levels */}
            {(item.categoryL1 || item.categoryL2 || item.categoryL3) && (
              <div className="flex flex-col gap-1 mt-1">
                {item.categoryL1 && (
                  <span className="text-xs text-muted-foreground/90 font-normal leading-snug">
                    {getCategoryEmoji(item.categoryL1)} <span className="text-[10px] font-medium opacity-70">L1</span> {item.categoryL1}
                  </span>
                )}
                {item.categoryL2 && (
                  <span className="text-xs text-muted-foreground/85 font-normal leading-snug">
                    {getCategoryEmoji(item.categoryL2)} <span className="text-[10px] font-medium opacity-70">L2</span> {item.categoryL2}
                  </span>
                )}
                {item.categoryL3 && (
                  <span className="text-xs text-muted-foreground/80 font-normal leading-snug">
                    {getCategoryEmoji(item.categoryL3)} <span className="text-[10px] font-medium opacity-70">L3</span> {item.categoryL3}
                  </span>
                )}
              </div>
            )}
            
            {/* Brand - Styled better with emoji */}
            {item.brand && (
              <p className="text-xs font-medium text-muted-foreground/90 mt-1.5 leading-snug">
                {getBrandEmoji(item.brand)} {item.brand}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <div className="relative w-full h-[80vh] bg-background rounded-lg overflow-hidden">
            {showFullImagePlaceholder ? (
              <div className="flex items-center justify-center w-full h-full">
                <ShoppingCart className="h-24 w-24 text-muted-foreground opacity-50" />
              </div>
            ) : (
              <Image
                key={fullImageUrl} // Force re-render when URL changes
                src={fullImageUrl!}
                alt={imageAlt}
                fill
                className="object-contain"
                sizes="100vw"
                onError={handleFullImageError}
                unoptimized
                priority={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
