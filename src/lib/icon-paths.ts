/**
 * SVG path data for common Lucide icons used in grocery categories.
 * These are extracted from lucide-react for fast, inline SVG rendering.
 */

export interface IconData {
  paths: string[];
  viewBox?: string;
}

export const iconPaths: Record<string, IconData> = {
  // Fruits & Vegetables - using 24x24 viewBox paths from lucide-react
  apple: {
    paths: [
      "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      "M12 6v7",
      "M9 9h6",
    ],
    viewBox: "0 0 24 24",
  },
  carrot: {
    paths: [
      "M2.27 21.7s9.87-9.87 10.03-10.07c.17-.2.49-.26.68-.09.2.17.26.5.09.69-.2.19-4.9 4.9-6.31 6.31a.49.49 0 0 1-.67.04l-.82-.88z",
      "M8.28 3.94a.45.45 0 0 0-.6-.04l-.56.56a.45.45 0 0 0-.04.6l.88.88c.17.17.5.11.68-.09l.19-.22a.45.45 0 0 0-.05-.6l-.9-.99z",
      "M13.12 3.94a.45.45 0 0 1 .6-.04l.56.56a.45.45 0 0 1 .04.6l-.88.88a.5.5 0 0 1-.68-.09l-.19-.22a.45.45 0 0 1 .05-.6l.9-.99z",
      "M9.09 12.96l-5.5 5.5a2.5 2.5 0 0 0 0 3.54l.38.38a2.5 2.5 0 0 0 3.54 0l5.5-5.5",
    ],
    viewBox: "0 0 24 24",
  },
  // Meat & Seafood
  beef: {
    paths: [
      "M16.39 7.5c-1.5 0-2.73.68-3.6 1.6-.87-.92-2.1-1.6-3.6-1.6-2.5 0-4.5 2-4.5 4.5 0 1.5.7 2.8 1.7 3.7L12 22l5.7-5.3c1-0.9 1.7-2.2 1.7-3.7 0-2.5-2-4.5-4.5-4.5z",
    ],
    viewBox: "0 0 24 24",
  },
  fish: {
    paths: [
      "M2.38 8.37c-1.5 1.5-1.5 3.92 0 5.42l9.83 9.83c1.5 1.5 3.92 1.5 5.42 0l.83-.83c1.5-1.5 1.5-3.92 0-5.42L8.63 7.54c-1.5-1.5-3.92-1.5-5.42 0l-.83.83z",
      "M8.37 8.37l7.26 7.26",
    ],
    viewBox: "0 0 24 24",
  },
  // Dairy
  milk: {
    paths: [
      "M8 2h8",
      "M9 2v2.789a4 4 0 0 0 .672 2.219l1.154 2.11a4 4 0 0 1 .336 1.874V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-8.219a4 4 0 0 1 .336-1.874l1.154-2.11A4 4 0 0 0 20 4.789V2",
      "M7 13h10",
      "M7 17h10",
      "M7 21h10",
    ],
    viewBox: "0 0 24 24",
  },
  cheese: {
    paths: [
      "M11.27 4.5L4.14 19.5a1 1 0 0 0 1.36 1.33L19.64 9.77a1 1 0 0 0-.63-1.67L13.5 8l-2.23-3.5z",
      "M14.5 8L22 14",
    ],
    viewBox: "0 0 24 24",
  },
  // Bakery
  chefHat: {
    paths: [
      "M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z",
      "M6 17h12",
    ],
    viewBox: "0 0 24 24",
  },
  bread: {
    paths: [
      "M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0z",
      "M12 2v20",
      "M2 12h20",
    ],
    viewBox: "0 0 24 24",
  },
  // Beverages
  coffee: {
    paths: [
      "M10 2v2",
      "M14 2v2",
      "M16 8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1z",
      "M18 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8",
      "M6 2v2",
      "M18 16v1a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-1",
    ],
    viewBox: "0 0 24 24",
  },
  wine: {
    paths: [
      "M8 2v6",
      "M16 2v6",
      "M5 8h14l-1 10H6z",
      "M12 18v4",
      "M8 22h8",
    ],
    viewBox: "0 0 24 24",
  },
  // Snacks
  cookie: {
    paths: [
      "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z",
      "M8.5 8.5h.01",
      "M15.5 8.5h.01",
      "M9 12h.01",
      "M15 12h.01",
      "M10.5 15.5h.01",
    ],
    viewBox: "0 0 24 24",
  },
  // Household
  spray: {
    paths: [
      "M3 3h.01",
      "M7 5h.01",
      "M21 12c0 1.66-1 3-2.5 3H12c-1.66 0-2.5-1.34-2.5-3s1-3 2.5-3h6.5c1.5 0 2.5 1.34 2.5 3z",
      "M12 12h.01",
      "M7 8h.01",
    ],
    viewBox: "0 0 24 24",
  },
  // Pet
  dog: {
    paths: [
      "M11 25h4v-5s1.5-2 1.5-4-1.5-4-1.5-4 1.5-2 1.5-4V6s-1.5-1-1.5-3 1.5-3 1.5-3h-4s1.5 0 1.5 3-1.5 3-1.5 3v2s0 2-1.5 4-1.5 4 0 2 1.5 4v5z",
      "M9 13c-1.5 0-4-.5-4-3s1.5-3 4-3",
      "M17 13c1.5 0 4-.5 4-3s-1.5-3-4-3",
    ],
    viewBox: "0 0 24 24",
  },
  // Default/General
  package: {
    paths: [
      "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 18v-8z",
      "M3.27 6.96L12 12.01l8.73-5.05",
      "M12 22.08V12",
    ],
    viewBox: "0 0 24 24",
  },
  shoppingCart: {
    paths: [
      "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z",
      "M3 6h18",
      "M16 10a4 4 0 0 1-8 0",
    ],
    viewBox: "0 0 24 24",
  },
};

/**
 * Maps category names to icon identifiers
 */
export function getIconForCategory(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  // Fruits
  if (lowerCategory.includes('fruit') || lowerCategory.includes('apple') || lowerCategory.includes('berry') || lowerCategory.includes('grape') || lowerCategory.includes('citrus') || lowerCategory.includes('melon')) {
    return 'apple';
  }
  
  // Vegetables
  if (lowerCategory.includes('vegetable') || lowerCategory.includes('carrot') || lowerCategory.includes('salad') || lowerCategory.includes('herb') || lowerCategory.includes('mushroom') || lowerCategory.includes('tomato')) {
    return 'carrot';
  }
  
  // Meat
  if (lowerCategory.includes('meat') || lowerCategory.includes('beef') || lowerCategory.includes('pork') || lowerCategory.includes('chicken') || lowerCategory.includes('butcher') || lowerCategory.includes('bacon') || lowerCategory.includes('ham') || lowerCategory.includes('sausage')) {
    return 'beef';
  }
  
  // Seafood
  if (lowerCategory.includes('seafood') || lowerCategory.includes('fish') || lowerCategory.includes('salmon') || lowerCategory.includes('prawn') || lowerCategory.includes('crab') || lowerCategory.includes('shrimp')) {
    return 'fish';
  }
  
  // Dairy
  if (lowerCategory.includes('milk') || lowerCategory.includes('cream') || lowerCategory.includes('yogurt') || lowerCategory.includes('yoghurt') || lowerCategory.includes('dairy')) {
    return 'milk';
  }
  
  if (lowerCategory.includes('cheese')) {
    return 'cheese';
  }
  
  // Bakery
  if (lowerCategory.includes('bread') && !lowerCategory.includes('cake') && !lowerCategory.includes('pastry')) {
    return 'bread';
  }
  
  if (lowerCategory.includes('bakery') || lowerCategory.includes('cake') || lowerCategory.includes('pastry') || lowerCategory.includes('croissant') || lowerCategory.includes('baguette') || lowerCategory.includes('cookie') || lowerCategory.includes('biscuit')) {
    return 'chefHat';
  }
  
  // Beverages
  if (lowerCategory.includes('coffee') || lowerCategory.includes('tea') || lowerCategory.includes('beverage') || lowerCategory.includes('hot beverage')) {
    return 'coffee';
  }
  
  if (lowerCategory.includes('wine') || lowerCategory.includes('beer') || lowerCategory.includes('spirit') || lowerCategory.includes('alcohol') || lowerCategory.includes('cider')) {
    return 'wine';
  }
  
  if (lowerCategory.includes('drink') || lowerCategory.includes('juice') || lowerCategory.includes('soda') || lowerCategory.includes('soft drink')) {
    return 'coffee';
  }
  
  // Snacks & Confectionery
  if (lowerCategory.includes('snack') || lowerCategory.includes('crisp') || lowerCategory.includes('chip') || lowerCategory.includes('candy') || lowerCategory.includes('chocolate') || lowerCategory.includes('confectionery')) {
    return 'cookie';
  }
  
  // Pasta & Rice
  if (lowerCategory.includes('pasta') || lowerCategory.includes('noodle') || lowerCategory.includes('rice') || lowerCategory.includes('spaghetti') || lowerCategory.includes('macaroni')) {
    return 'package';
  }
  
  // Canned & Prepared Foods
  if (lowerCategory.includes('canned') || lowerCategory.includes('prepared') || lowerCategory.includes('ready meal') || lowerCategory.includes('soup')) {
    return 'package';
  }
  
  // Health & Beauty
  if (lowerCategory.includes('health') || lowerCategory.includes('beauty') || lowerCategory.includes('skincare') || lowerCategory.includes('hair care') || lowerCategory.includes('dental') || lowerCategory.includes('shampoo')) {
    return 'spray';
  }
  
  // Household & Cleaning
  if (lowerCategory.includes('household') || lowerCategory.includes('cleaning') || lowerCategory.includes('laundry') || lowerCategory.includes('detergent') || lowerCategory.includes('tissue') || lowerCategory.includes('paper')) {
    return 'spray';
  }
  
  // Pet
  if (lowerCategory.includes('pet') || lowerCategory.includes('dog') || lowerCategory.includes('cat')) {
    return 'dog';
  }
  
  // Default
  return 'package';
}

/**
 * Gets icon SVG paths for a category
 */
export function getIconPaths(category: string): IconData {
  const iconName = getIconForCategory(category);
  return iconPaths[iconName] || iconPaths.package;
}
