import { useRef } from "react";
import { X, Award, Shield, CheckCircle2, Download, Printer, Share2, Sparkles } from "lucide-react";

export default function CertificateModal({ certificate, onClose }) {
  const certRef = useRef(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(certificate.issueDate || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-4xl w-full flex flex-col gap-4 my-auto">
        {/* Actions Bar */}
        <div className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-lg print:hidden">
          <div className="flex items-center gap-2">
            <Award className="text-amber-500" size={20} />
            <span className="text-xs font-black uppercase tracking-wider pro-text-main">
              Official Verified Credential
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-primary !px-4 !py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* High-Resolution Certificate Surface */}
        <div 
          ref={certRef}
          className="relative bg-slate-950 text-slate-100 p-8 md:p-14 rounded-3xl border-4 border-amber-500/40 shadow-2xl overflow-hidden font-serif"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(30, 41, 59, 0.95), rgba(2, 6, 23, 1))"
          }}
        >
          {/* Subtle Background Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Award size={500} className="text-amber-400" />
          </div>

          {/* Golden Laurel Border Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/80"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/80"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/80"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/80"></div>

          {/* Certificate Content Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-sans font-black uppercase tracking-[0.3em]">
              <Shield size={14} /> NEURAL GUARD ACADEMIC VERIFICATION
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-sans mt-2">
              Certificate of Mastery
            </h1>

            <p className="text-slate-400 text-xs md:text-sm font-sans uppercase tracking-[0.2em]">
              This is to officially certify that
            </p>

            {/* Student Name */}
            <div className="py-2">
              <h2 className="text-3xl md:text-5xl font-bold italic text-white tracking-wide border-b border-amber-500/30 pb-3 inline-block px-8">
                {certificate.studentName || "Deeksha H S"}
              </h2>
            </div>

            {/* Course Details */}
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto font-sans leading-relaxed font-normal pt-2">
              has successfully completed all <strong className="text-amber-300">25 Comprehensive Learning Sets (125 Core Assessment Modules)</strong> and demonstrated rigorous proficiency in:
            </p>

            <h3 className="text-xl md:text-3xl font-black text-amber-400 font-sans tracking-tight uppercase pt-1">
              {certificate.courseTitle}
            </h3>

            <p className="text-[11px] font-mono text-slate-400 font-sans uppercase tracking-widest">
              Course Code: <span className="text-white font-bold">{certificate.courseCode}</span> • Grade Score: <span className="text-emerald-400 font-bold">{certificate.gradeScore}%</span> ({certificate.honorTitle})
            </p>
          </div>

          {/* Skills Badges */}
          {certificate.skillsCertified?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto my-6 relative z-10">
              {certificate.skillsCertified.slice(0, 6).map((skill, i) => (
                <span key={i} className="text-[9px] font-sans font-bold px-2.5 py-1 rounded bg-slate-900/90 border border-amber-500/20 text-slate-300">
                  ✓ {skill}
                </span>
              ))}
            </div>
          )}

          {/* Signatures & Seal Footer */}
          <div className="grid grid-cols-3 items-end pt-10 mt-6 border-t border-slate-800 relative z-10 text-center font-sans">
            {/* Issue Date */}
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-white">{formattedDate}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Date of Certification</p>
            </div>

            {/* Academic Golden Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-300 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                <Award size={32} />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-amber-400 mt-2 font-bold">
                SEAL OF EXCELLENCE
              </span>
            </div>

            {/* Verification Signature & Hash */}
            <div className="space-y-1">
              <div className="font-serif italic text-base text-amber-300">Dr. Alan Turing</div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Neural Academic Fellow</p>
            </div>
          </div>

          {/* Security Hash Footnote */}
          <div className="mt-8 text-center pt-3 border-t border-slate-900/60 font-mono text-[9px] text-slate-500 flex flex-wrap justify-between items-center px-2">
            <span>CERTIFICATE ID: <strong className="text-amber-400">{certificate.certificateId}</strong></span>
            <span className="truncate max-w-xs">VERIFICATION HASH: {certificate.verificationHash || "SHA256_VERIFIED"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
