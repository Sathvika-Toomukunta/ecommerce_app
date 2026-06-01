import { X } from 'lucide-react';

interface FiltersProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  onClose?: () => void;
}

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function ProductFilters({
  selectedCategory, setSelectedCategory,
  priceRange, setPriceRange,
  minRating, setMinRating,
  onClose,
}: FiltersProps) {
  const clearAll = () => {
    setSelectedCategory('All');
    setPriceRange([0, 2000]);
    setMinRating(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-base">Filters</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Category</h4>
        <div className="space-y-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-700 font-medium">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1] === 2000 ? '2000+' : priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="grid grid-cols-2 gap-2">
            {[[0,100],[100,500],[500,1000],[1000,2000]].map(([min,max]) => (
              <button
                key={`${min}-${max}`}
                onClick={() => setPriceRange([min, max])}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  priceRange[0] === min && priceRange[1] === max
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                }`}
              >
                ${min}–${max === 2000 ? '2000+' : max}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[0, 3, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                minRating === rating ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {rating === 0 ? (
                <span>All ratings</span>
              ) : (
                <>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-xs ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                    ))}
                  </div>
                  <span>& up</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
