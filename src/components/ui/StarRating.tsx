import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 12 : 15;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= Math.floor(rating);
          const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0;
          return (
            <div key={star} className="relative">
              <Star size={starSize} className="text-slate-200" fill="#e2e8f0" />
              {(filled || partial) && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}>
                  <Star size={starSize} className="text-amber-400" fill="#fbbf24" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {count !== undefined && (
        <span className={`text-slate-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
