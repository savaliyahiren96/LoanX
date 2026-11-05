import React, { useState } from 'react';
import { 
  FileUp, 
  FileText, 
  Mic, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  RefreshCw,
  HelpCircle,
  Eye,
  Trash2
} from 'lucide-react';

interface VoiceDocumentAnalysisViewProps {
  onAnalyzeDocumentWithVoice: (docText: string, docName: string, query?: string) => void;
  language: string;
}

const SAMPLE_SANCTION_LETTERS = [
  {
    title: 'Private Bank Sanction Letter (With Bundled Insurance & High Fee)',
    name: 'Sample_HDFC_Sanction_Letter.txt',
    content: `LOAN SANCTION LETTER
Branch: Nariman Point, Mumbai
Date: 12-Oct-2024
Borrower: Rajesh K. Patel
Loan Account Ref: HL/2024/98471

Subject: Sanction of Home Loan Facility

Dear Mr. Patel,
We are pleased to inform you that your request for a Housing Loan has been sanctioned subject to the terms and conditions outlined below:

1. Sanctioned Loan Amount: ₹35,00,000/- (Thirty-Five Lakhs Only)
2. Facility Type: Home Loan (Floating Rate)
3. Benchmark: EBLR (Repo Linked Lending Rate)
4. Interest Rate: 8.85% p.a. (RBI Repo Rate 6.50% + Bank Spread 2.35%)
5. Loan Tenure: 240 Months (20 Years)
6. Equated Monthly Installment (EMI): ₹31,162/-
7. Processing Fee: ₹17,500/- plus applicable GST @ 18% (₹3,150/-)
8. Mandatory Loan Suraksha / Credit Protect Insurance: ₹1,42,500/- (Single Premium policy bundled into principal loan amount)
9. Administrative & Legal Search Charges: ₹8,500/-
10. Foreclosure / Part-Prepayment: In the event of closure within 12 months, an administrative penalty of 1.5% shall apply.

Note: Disbursement is subject to acceptance of mandatory credit insurance policy and execution of standard loan agreement.`
  },
  {
    title: 'Clean PSU Bank Sanction Letter (SBI Compliant Format)',
    name: 'Sample_SBI_Sanction_Letter.txt',
    content: `STATE BANK OF INDIA
RACPC Ahmedabad Branch
Date: 04-Nov-2024
Sanction Letter Ref: SBI/HL/AHM/2024/0912

To: Smt. Priya Sharma & Shri Amit Sharma
Subject: Sanction of SBI Regular Home Loan

Dear Customer,
We are pleased to sanction your housing loan on the following transparent terms:

1. Loan Sanctioned: ₹40,00,000/-
2. Rate of Interest: 8.50% p.a. (Floating)
   - Linked to RBI Repo Rate (6.50%) + Spread (2.00%)
3. Tenure: 240 Months
4. Estimated Monthly EMI: ₹34,713/-
5. Processing Fee: Flat ₹5,000/- + 18% GST (Festival Campaign Concession)
6. Insurance: Voluntary. Borrower may assign existing Term Life Policy or opt for SBI Life Rinn Raksha.
7. Prepayment / Foreclosure Penalty: NIL (0%) per RBI Guidelines.
8. Key Fact Statement (KFS): Attached as Annexure-A with computed APR of 8.61%.`
  }
];

export const VoiceDocumentAnalysisView: React.FC<VoiceDocumentAnalysisViewProps> = ({
  onAnalyzeDocumentWithVoice,
  language,
}) => {
  const [docName, setDocName] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [userVoiceQuery, setUserVoiceQuery] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setDocName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocContent(text || 'Document loaded. Ask any question about charges, interest, or clauses.');
      setIsProcessingFile(false);
    };
    reader.onerror = () => {
      alert('Could not read file. Please paste the text directly.');
      setIsProcessingFile(false);
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_SANCTION_LETTERS[0]) => {
    setDocName(sample.name);
    setDocContent(sample.content);
  };

  const handleSubmitAnalysis = () => {
    if (!docContent) {
      alert('Please upload or select a document first.');
      return;
    }
    const defaultQuery = language === 'gu'
      ? 'આ ડોક્યુમેન્ટમાં બેંકે કયા વધારાના ચાર્જ લીધા છે? અને શું કોઈ અન્યાયી શરતો છે?'
      : language === 'hi'
      ? 'इस सैंक्शन लेटर में बैंक ने क्या अतिरिक्त चार्ज लगाए हैं? और क्या कोई जोखिम भरी शर्त है?'
      : 'What extra charges has the bank included in this document, and are there any risky or unfair terms?';

    onAnalyzeDocumentWithVoice(docContent, docName || 'Sanction_Letter.txt', userVoiceQuery || defaultQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <FileUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Voice Document Analysis – Inspect Sanction Letters & Agreements
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100">
              Upload any loan document or sanction letter, then ask questions verbally in your preferred language
            </p>
          </div>
        </div>
        <p className="text-xs text-white/90 max-w-2xl mt-1">
          Example: Speak in Gujarati &ldquo;આ ડોક્યુમેન્ટમાં બેંકે કયા વધારાના ચાર્જ લીધા છે?&rdquo; or in Hindi &ldquo;क्या इस लेटर में इंश्योरेंस अनिवार्य लिखा है?&rdquo;
        </p>
      </div>

      {/* Upload Box & Pre-loaded Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload or Paste Document */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center hover:border-emerald-500 transition-colors">
            <FileUp className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upload Loan Sanction Letter, Agreement or Key Fact Statement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Supports .txt, .pdf, .docx, images, or paste text below
            </p>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md">
              <span>Choose Document File</span>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Document Content Textarea */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>{docName ? `Document: ${docName}` : 'Or Paste Document Text Here:'}</span>
              </span>
              {docContent && (
                <button
                  onClick={() => {
                    setDocContent('');
                    setDocName('');
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              rows={8}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Paste the text of your loan offer, email quotation, sanction letter, or repayment agreement here..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Question / Spoken Query Input */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              What do you want to ask about this document?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userVoiceQuery}
                onChange={(e) => setUserVoiceQuery(e.target.value)}
                placeholder={
                  language === 'gu'
                    ? 'દા.ત. આ ડોક્યુમેન્ટમાં બેંકે કયા વધારાના ચાર્જ લીધા છે?'
                    : language === 'hi'
                    ? 'उदा. इस सैंक्शन लेटर में क्या कोई छिपा हुआ चार्ज है?'
                    : 'e.g. Is the insurance compulsory in this document?'
                }
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSubmitAnalysis}
                disabled={!docContent || isProcessingFile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Analyze Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Pre-Loaded Sample Letters */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Try Pre-Loaded Sample Letters</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Click either sample below to load it instantly and see how AskLoanGuru identifies buried traps and hidden charges:
            </p>

            <div className="space-y-2.5">
              {SAMPLE_SANCTION_LETTERS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    docName === sample.name
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{sample.title}</span>
                    {docName === sample.name && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {sample.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>What AskLoanGuru checks in your document:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>Unbundled single-premium insurance (₹1L - ₹2L trap)</li>
              <li>Spread markup over RBI Repo rate</li>
              <li>Illegal foreclosure penalties on floating loans</li>
              <li>Administrative, search, and CIBIL report markups</li>
              <li>Mandatory Key Fact Statement (KFS) compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
