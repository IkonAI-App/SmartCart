"use server";
import { parseAndSaveGroceryItems } from "@/lib/data";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process CSV file.";
    return { success: false, error: errorMessage };
  }
}
