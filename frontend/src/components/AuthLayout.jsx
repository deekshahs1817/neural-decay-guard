export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">

      <div className="w-[420px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-10">

        {children}

      </div>

    </div>
  );
}