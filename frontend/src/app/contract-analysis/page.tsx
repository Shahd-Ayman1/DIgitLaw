"use client";

import { useState } from "react";
import { Loader2, FileSearch } from "lucide-react";
import { UploadComponent } from "@/components/upload-component";
import { ContractReport } from "@/components/contract-report";
import { Button } from "@/components/ui/button";
import { analyzeContract, ApiError } from "@/lib/api";
import type { ContractAnalysisResponse } from "@/types/api";

export default function ContractAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeContract(file);
      setResult(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24">
      <header className="mb-6">
        <h1 className="text-xl font-extrabold flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-primary" />
          تحليل العقود
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          ارفع عقدك بصيغة PDF أو DOCX للحصول على تحليل شامل للبنود والمخاطر والتوصيات بالعربية المبسطة.
        </p>
      </header>

      <div className="space-y-4">
        <UploadComponent onFileSelect={setFile} disabled={loading} />

        <Button onClick={handleAnalyze} disabled={!file || loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جاري تحليل العقد...
            </>
          ) : (
            "تحليل العقد"
          )}
        </Button>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8">
          <ContractReport data={result} />
          {result.warnings.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4">ملاحظات: {result.warnings.join("، ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
