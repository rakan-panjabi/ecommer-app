import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto space-y-6">
        {/* SVG Alert Icon */}
        <div className="w-20 h-20 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* এরর কোড ও টাইটেল */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* হোমপেজে ফেরার বাটন */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
          >
            {/* SVG Home Icon */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
