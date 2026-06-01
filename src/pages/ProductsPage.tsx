import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, List, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, SortOption } from '../lib/types';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridView, setGridView] = useState<'grid' | 'list'>('grid');
  const [sortOpen, setSortOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>('featured');
  const [searchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    result = result.filter(p => p.rating >= minRating);

    if (searchParams.get('featured') === 'true') result = result.filter(p => p.is_featured);
    if (searchParams.get('new') === 'true') result = result.filter(p => p.is_new);

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    setFiltered(result);
  }, [products, selectedCategory, priceRange, minRating, sort, searchParams, searchTerm]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const pageTitle = searchTerm
    ? `Search: "${searchTerm}"`
    : selectedCategory !== 'All'
    ? selectedCategory
    : searchParams.get('featured') === 'true'
    ? 'Featured Products'
    : searchParams.get('new') === 'true'
    ? 'New Arrivals'
    : 'All Products';

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">{pageTitle}</h1>
          <p className="text-slate-500 mt-1">{loading ? 'Loading...' : `${filtered.length} products found`}</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
              />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {filtersOpen && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
              <div className="relative w-80 max-w-full bg-white h-full overflow-y-auto p-6 shadow-2xl ml-auto">
                <ProductFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={handleCategoryChange}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  onClose={() => setFiltersOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 bg-white border border-slate-100 rounded-2xl px-4 py-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium border border-slate-200 rounded-xl px-3 py-2 transition-colors hover:border-slate-300">
                    <span>{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-10">
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sort === opt.value ? 'text-emerald-600 font-semibold bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setGridView('grid')}
                    className={`p-2 transition-colors ${gridView === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Grid3X3 size={16} />
                  </button>
                  <button onClick={() => setGridView('list')}
                    className={`p-2 transition-colors ${gridView === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(selectedCategory !== 'All' || priceRange[1] < 2000 || minRating > 0) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-slate-500 font-medium">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {selectedCategory}
                    <button onClick={() => handleCategoryChange('All')} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                  </span>
                )}
                {priceRange[1] < 2000 && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    Up to ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, 2000])} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {minRating}+ stars
                    <button onClick={() => setMinRating(0)} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-6 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters or search term</p>
                <button onClick={() => { handleCategoryChange('All'); setPriceRange([0, 2000]); setMinRating(0); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${gridView === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
