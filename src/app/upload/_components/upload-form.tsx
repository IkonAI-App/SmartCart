"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadCsvAction } from "../_actions/upload-csv-action";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setDebugInfo(null); // Clear previous debug info on new file selection
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
    setDebugInfo(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
        await uploadCsvAction(formData);
        // The redirect will happen on the server, so we might not see the success toast.
        // The user will see the home page with updated data.
    } catch (error: any) {
         setIsSubmitting(false);
         
         // Extract and display detailed error information
         let errorDetails = "An unknown error occurred.";
         if (error) {
            if (error.digest) {
              try {
                const digestData = JSON.parse(error.digest);
                errorDetails = JSON.stringify(digestData, null, 2);
              } catch {
                errorDetails = `Digest: ${error.digest}\n\nMessage: ${error.message}`;
              }
            } else {
               errorDetails = error.message ? `Error: ${error.message}\n\nStack: ${error.stack}` : JSON.stringify(error, null, 2);
            }
         }
         
         setDebugInfo(errorDetails);

         toast({
            variant: "destructive",
            title: "Upload failed",
            description: "An unknown error occurred. See debug info below.",
        });
    }
  };

  return (
    <div className="space-y-6">
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

      {debugInfo && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Debug Information</AlertTitle>
          <AlertDescription>
            <pre className="mt-2 w-full rounded-md bg-muted p-4 overflow-x-auto text-sm">
              <code>{debugInfo}</code>
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
