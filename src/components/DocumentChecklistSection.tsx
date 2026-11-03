import React, { useState } from 'react';
import { UserLoanInput, Language } from '../types';
import { translations } from '../translations';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  UploadCloud,
  Layers,
  HelpCircle
} from 'lucide-react';

interface DocumentChecklistProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const DocumentChecklistSection: React.FC<DocumentChecklistProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  // Dynamic document list based on loan type & employment
  const getDocuments = () => {
    const commonDocs = [
      { id: 'kyc_pan', label: 'PAN Card (Mandatory for all financial transactions in India)', required: true },
      { id: 'kyc_aadhaar', label: 'Aadhaar Card / Passport / Voter ID (Identity & Address Proof)', required: true },
      { id: 'bank_statement', label: 'Last 6 Months Bank Account Statements (Salary / Operating Account)', required: true },
      { id: 'photos', label: '2 Passport Size Photographs', required: true },
    ];

    let incomeDocs = [];
    if (input.employmentType === 'salaried') {
      incomeDocs = [
        { id: 'sal_slips', label: 'Latest 3 Months Salary Slips (with company stamp / digital seal)', required: true },
        { id: 'form_16', label: 'Latest 2 Years Form 16 (Part A & B) & ITR Acknowledgment', required: true },
        { id: 'emp_id', label: 'Company ID Card & Official Email Verification', required: false },
      ];
    } else {
      incomeDocs = [
        { id: 'itr_comp', label: 'Last 3 Years ITR with Computation of Income, Balance Sheet & P&L (CA Certified)', required: true },
        { id: 'gst_returns', label: 'Last 12 Months GST Returns (GSTR-3B & GSTR-1)', required: true },
        { id: 'biz_proof', label: 'Business Proof (Shop Act License / Udyam MSME / GST Certificate)', required: true },
      ];
    }

    let collateralDocs: { id: string; label: string; required: boolean }[] = [];
    if (input.loanType === 'home' || input.loanType === 'lap') {
      collateralDocs = [
        { id: 'title_deed', label: 'Chain of Title Deeds / Sale Deed / Allotment Letter (Originals)', required: true },
        { id: 'sanction_plan', label: 'Approved Building Sanction Plan from Municipal Corporation / Gram Panchayat', required: true },
        { id: 'encumbrance', label: 'Encumbrance Certificate (EC) for past 13 to 30 years from Sub-Registrar', required: true },
        { id: 'tax_receipts', label: 'Latest Property Tax Paid Receipts and NOC from Society / Builder', required: true },
      ];
    } else if (input.loanType === 'car') {
      collateralDocs = [
        { id: 'proforma', label: 'Proforma Invoice / Quotation from Authorized Car Dealer', required: true },
        { id: 'rc_copy', label: input.isNewCar ? 'Down payment margin receipt' : 'RC Book & Insurance copy of used car', required: true },
      ];
    } else if (input.loanType === 'gold') {
      collateralDocs = [
        { id: 'gold_jewels', label: 'Original Gold Ornaments (Minimum 18K purity; Net weight verified at bank)', required: true },
        { id: 'gold_invoice', label: 'Original Jewellery Purchase Bill / Hallmarking Certificate (if available)', required: false },
      ];
    } else if (input.loanType === 'education') {
      collateralDocs = [
        { id: 'admission_letter', label: 'Confirmed Admission Offer Letter with detailed fee breakdown', required: true },
        { id: 'academic_records', label: '10th, 12th, Degree Marksheets & Entrance Test Scores (GRE, IELTS, CAT)', required: true },
        { id: 'co_borrower', label: 'Co-borrower (Parent/Guardian) Income & KYC Documents', required: true },
      ];
    }

    return { commonDocs, incomeDocs, collateralDocs };
  };

  const { commonDocs, incomeDocs, collateralDocs } = getDocuments();
  const allDocs = [...commonDocs, ...incomeDocs, ...collateralDocs];
  const readyCount = allDocs.filter((d) => checkedDocs[d.id]).length;

  const steps = [
    {
      step: 'Step 1',
      title: 'CIBIL Check & Application Login',
      timeline: 'Day 1–2',
      desc: 'Submit KYC, income proofs & loan application. Bank pulls CIBIL score & verifies eligibility.',
    },
    {
      step: 'Step 2',
      title: 'Legal & Technical Valuation',
      timeline: 'Day 3–5',
      desc: 'Bank lawyer inspects title chain (EC for 30 yrs), and independent engineer assesses market value.',
    },
    {
      step: 'Step 3',
      title: 'Sanction Letter & Negotiation',
      timeline: 'Day 6–7',
      desc: 'Bank issues Sanction Letter with approved loan amount, EBLR spread, processing fee & tenure. Review & negotiate!',
    },
    {
      step: 'Step 4',
      title: 'Agreement Signing & Disbursal',
      timeline: 'Day 8–10',
      desc: 'Sign loan agreement, execute MODT at sub-registrar (if property), and bank transfers funds directly.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-blue-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Application Process & Document Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized for {t.loanTypes[input.loanType]} ({input.employmentType === 'salaried' ? 'Salaried' : 'Self-Employed'})
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Process Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Step-by-Step Approval Timeline
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 relative space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span>{s.step}</span>
                <span className="text-slate-400 flex items-center gap-1 font-normal">
                  <Clock className="w-3 h-3" />
                  {s.timeline}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {s.title}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Ready-to-Submit Document Checklist
          </h4>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
            {readyCount} of {allDocs.length} Documents Gathered
          </span>
        </div>

        {/* Categories of Docs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* KYC */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              1. Identity & Address (KYC)
            </span>
            <div className="space-y-2">
              {commonDocs.map((doc) => (
                <label
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className="flex items-start gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[doc.id]}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                    {doc.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Income Proofs */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              2. Income & Financial Proofs
            </span>
            <div className="space-y-2">
              {incomeDocs.map((doc) => (
                <label
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className="flex items-start gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[doc.id]}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                    {doc.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Collateral / Asset Specific */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block border-b border-slate-200 dark:border-slate-700 pb-1.5">
              3. Loan & Asset Specific Papers
            </span>
            <div className="space-y-2">
              {collateralDocs.map((doc) => (
                <label
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className="flex items-start gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[doc.id]}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={checkedDocs[doc.id] ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                    {doc.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
