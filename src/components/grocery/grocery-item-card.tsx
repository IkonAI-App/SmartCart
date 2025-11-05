import type { GroceryItem } from "@/lib/data";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CategoryIcon } from "./category-icon";

interface GroceryItemCardProps {
  item: GroceryItem;
}

export function GroceryItemCard({ item }: GroceryItemCardProps) {
  const placeholder = PlaceHolderImages.find(
    (p) => p.id === `grocery-${item.id}`
  );

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
        {placeholder ? (
          <Image
            src={placeholder.imageUrl}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-headline leading-tight">
            {item.name}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 ml-2">
            <CategoryIcon category={item.category} className="h-4 w-4" />
            <span>{item.category}</span>
          </div>
        </div>
        <div className="flex-grow"></div>
        <p className="text-2xl font-bold font-sans text-primary mt-2">
          ${item.price.toFixed(2)}
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
