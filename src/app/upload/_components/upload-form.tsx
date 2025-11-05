"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadCsvAction } from "../_actions/upload-csv-action";
import { Loader2 } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file to upload.",
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadCsvAction(formData);

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Upload successful",
        description: "Your grocery list has been updated.",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="csv-file">CSV File</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={!file || isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload and Process"
        )}
      </Button>
    </form>
  );
}
