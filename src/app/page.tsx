import { Header } from "@/components/header";
import GroceryList from "@/components/grocery/grocery-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';

export default async function Home() {
  const csvFilePath = path.join(process.cwd(), 'public/data/grocery-items.csv');
  let csvExists = false;
  try {
    await fs.stat(csvFilePath);
    csvExists = true;
  } catch (error) {
    csvExists = false;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="space-y-4 mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">
            Your Grocery List
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Efficiently manage your shopping with a smart, filterable list of
            your favorite items.
          </p>
        </div>
        {csvExists ? (
          <GroceryList />
        ) : (
          <div className="text-center py-16 rounded-lg border-2 border-dashed">
            <p className="text-lg text-muted-foreground">
              No grocery items found.
            </p>
            <p className="text-sm text-muted-foreground/80 mb-4">
              Upload your CSV file to get started.
            </p>
            <Button asChild>
              <Link href="/upload">Upload CSV</Link>
            </Button>
          </div>
        )}
      </main>
      <footer className="py-6 md:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartSearch. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
