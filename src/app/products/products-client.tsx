"use client";

import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/currency/currency-provider";
import type { Category, FilterState, Product, ProductCategory } from "@/types";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

export function ProductsClient({
  products: catalog,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const queryParam = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam ?? undefined,
    search: queryParam || undefined,
    sort: "featured",
    inStock: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(queryParam);
  const { toUsd, format, currency } = useCurrency();

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam ?? undefined,
      search: queryParam || undefined,
    }));
    setSearchInput(queryParam);
  }, [categoryParam, queryParam]);

  const filtered = useMemo(() => {
    let products = [...catalog];

    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters.inStock) {
      products = products.filter((p) => p.in_stock);
    }
    if (filters.search) {
      const needle = filters.search.toLowerCase();
      products = products.filter((p) =>
        [p.name, p.sku, p.short_description, p.category].join(" ").toLowerCase().includes(needle)
      );
    }
    if (filters.priceMin !== undefined) {
      products = products.filter((p) => p.price >= toUsd(filters.priceMin!));
    }
    if (filters.priceMax !== undefined) {
      products = products.filter((p) => p.price <= toUsd(filters.priceMax!));
    }

    switch (filters.sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        products.sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;
      case "az":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return products;
  }, [catalog, filters, toUsd]);

  function clearFilter(key: keyof FilterState) {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const activeFilterCount = [
    filters.category,
    filters.inStock,
    filters.priceMin,
    filters.priceMax,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container-wide py-14 lg:py-16">
          <p className="eyebrow">Catalogue</p>
          <h1 className="display-lg text-slate-900">Commercial Inflatables</h1>
          <p className="spec mt-5 text-[0.8125rem] uppercase tracking-[0.14em] text-slate-500">
            {filtered.length} products
            {filters.category
              ? ` · ${filters.category.replace(/-/g, " ")}`
              : ""}
          </p>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
            {filters.search && (
              <FilterChip
                label={`Search: ${filters.search}`}
                onRemove={() => {
                  setSearchInput("");
                  clearFilter("search");
                }}
              />
            )}
              {filters.category && (
                <FilterChip
                  label={`Category: ${filters.category.replace(/-/g, " ")}`}
                  onRemove={() => clearFilter("category")}
                />
              )}
              {filters.inStock && (
                <FilterChip label="In Stock" onRemove={() => clearFilter("inStock")} />
              )}
              {filters.priceMin && (
                <FilterChip
                  label={`Min: ${format(toUsd(filters.priceMin))}`}
                  onRemove={() => clearFilter("priceMin")}
                />
              )}
              {filters.priceMax && (
                <FilterChip
                  label={`Max: ${format(toUsd(filters.priceMax))}`}
                  onRemove={() => clearFilter("priceMax")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="flex gap-8">
          {/* Sidebar, desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 btn-secondary text-sm py-2 px-4"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <form
                className="flex items-center gap-2 flex-1 min-w-[180px] max-w-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFilters((p) => ({ ...p, search: searchInput.trim() || undefined }));
                }}
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products"
                    className="input text-sm py-2 pl-9"
                  />
                </div>
              </form>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500 hidden sm:block">Sort by</span>
                <select
                  value={filters.sort ?? "featured"}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      sort: e.target.value as FilterState["sort"],
                    }))
                  }
                  className="text-sm border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:border-orange-400 bg-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-500 text-sm">No products match your filters.</p>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setFilters({ sort: "featured" });
                  }}
                  className="mt-4 btn-secondary text-sm py-2 px-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 6} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-slate-100 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSidebar({
  filters,
  setFilters,
  categories,
}: {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  categories: Category[];
}) {
  const { currency } = useCurrency();
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setFilters((p) => ({ ...p, category: undefined }))}
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors",
                !filters.category
                  ? "bg-orange-50 text-orange-700 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() =>
                  setFilters((p) => ({ ...p, category: cat.slug }))
                }
                className={cn(
                  "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between",
                  filters.category === cat.slug
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-slate-400">{cat.product_count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Price Range ({currency})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Min</label>
            <input
              type="number"
              placeholder="$0"
              className="input text-sm py-1.5"
              value={filters.priceMin ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  priceMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Max</label>
            <input
              type="number"
              placeholder="Any"
              className="input text-sm py-1.5"
              value={filters.priceMax ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  priceMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) =>
              setFilters((p) => ({ ...p, inStock: e.target.checked }))
            }
            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          In stock only
        </label>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {label}
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-slate-700 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
