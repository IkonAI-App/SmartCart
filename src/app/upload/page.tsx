import { Header } from "@/components/header";
import UploadForm from "./_components/upload-form";

export default function UploadPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-xl mx-auto">
          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight text-foreground">
              Upload Your CSV
            </h2>
            <p className="text-lg text-muted-foreground">
              Upload your own grocery list in CSV format.
            </p>
          </div>
          <div className="p-8 border rounded-lg bg-card shadow-sm">
            <UploadForm />
          </div>
        </div>
      </main>
      <footer className="py-6 md:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartCart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
