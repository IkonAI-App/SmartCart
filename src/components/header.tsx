import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2">
            <ShoppingCart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">
            SmartCart
          </h1>
        </a>
        <Button variant="outline">
            My List
        </Button>
      </div>
    </header>
  );
}
