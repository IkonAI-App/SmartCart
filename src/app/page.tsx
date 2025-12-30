"use client";

import { Header } from "@/components/header";
import dynamic from 'next/dynamic';

const GroceryList = dynamic(() => import("@/components/grocery/grocery-list"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background">
            <span className="text-muted-foreground">Loading search...</span>
          </div>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
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
        <GroceryList />
      </main>
      <footer className="py-6 md:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartSearch. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
