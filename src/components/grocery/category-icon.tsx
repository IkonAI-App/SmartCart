import type { LucideProps } from "lucide-react";
import { Apple, Milk, ChefHat, Beef, Carrot, Wheat } from "lucide-react";

interface CategoryIconProps extends LucideProps {
  category: string;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case "fruit":
      return <Apple {...props} />;
    case "dairy":
      return <Milk {...props} />;
    case "bakery":
      return <ChefHat {...props} />;
    case "meat":
      return <Beef {...props} />;
    case "vegetable":
      return <Carrot {...props} />;
    default:
      return <Wheat {...props} />;
  }
}
