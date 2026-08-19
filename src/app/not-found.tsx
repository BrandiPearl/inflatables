import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-slate-100 leading-none mb-6">404</div>
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Try browsing our products or heading back home.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/products" className="btn-secondary">
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
