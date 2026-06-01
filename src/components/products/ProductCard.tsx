import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(!wishlist);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img
          src={imgError ? `https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400` : `${product.image_url}?auto=compress&cs=tinysrgb&w=400`}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
          )}
          {product.is_new && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-lg">NEW</span>
          )}
          {product.stock === 0 && (
            <span className="bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-lg">Sold Out</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button onClick={handleWishlist}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${wishlist ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-500'}`}>
            <Heart size={15} fill={wishlist ? 'currentColor' : 'none'} />
          </button>
          <button className="w-9 h-9 bg-white text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-center shadow-lg transition-colors">
            <Eye size={15} />
          </button>
        </div>

        {/* Add to Cart overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-950 hover:bg-emerald-600 text-white'
            }`}
          >
            <ShoppingCart size={15} />
            {added ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
        <h3 className="text-slate-800 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviews_count.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-slate-900 font-bold text-lg">${product.price.toFixed(2)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-slate-400 text-sm line-through">${product.original_price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
