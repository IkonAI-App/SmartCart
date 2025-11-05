"use server";
import { parseAndSaveGroceryItems } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

export async function uploadCsvAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file uploaded." };
  }

  if (file.type !== "text/csv") {
    return { success: false, error: "Invalid file type. Please upload a CSV." };
  }

  try {
    const fileContent = await file.text();
    await parseAndSaveGroceryItems(fileContent);
    
    // Instead of revalidating here, we will redirect and let the home page fetch the new data.
    // revalidatePath("/");
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process CSV file.";
    return { success: false, error: errorMessage };
  }

  redirect('/');
}
