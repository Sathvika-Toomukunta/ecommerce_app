import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import StarRating from '../components/ui/StarRating';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const inCart = items.find(i => i.product.id === id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) {
        setProduct(data);
        setSelectedImage(0);
        supabase.from('products').select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4)
          .then(({ data: rel }) => setRelated(rel || []));
      }
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product?.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const allImages = product
    ? [product.image_url, ...(product.images?.filter(img => img !== product.image_url) || [])]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen pt-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-slate-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-6 bg-slate-100 rounded-xl w-1/2" />
              <div className="h-12 bg-slate-100 rounded-xl w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-emerald-600 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-emerald-600 transition-colors">Products</button>
          <span>/</span>
          <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-emerald-600 transition-colors">{product.category}</button>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-medium transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden">
              <img
                src={`${allImages[selectedImage]}?auto=compress&cs=tinysrgb&w=700`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                  -{discount}% OFF
                </span>
              )}
              {product.is_new && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                  NEW
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-emerald-500 shadow-md' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={`${img}?auto=compress&cs=tinysrgb&w=120`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wide mb-2">{product.brand}</p>
              <h1 className="text-3xl font-black text-slate-800 leading-tight mb-3">{product.name}</h1>
              <StarRating rating={product.rating} count={product.reviews_count} size="md" />
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 pb-6 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className="text-xl text-slate-400 line-through mb-1">${product.original_price.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-lg mb-1">Save ${(product.original_price - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                {product.stock > 10 ? `In stock (${product.stock} available)` : product.stock > 0 ? `Low stock — only ${product.stock} left!` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                      disabled={quantity <= 1}>
                      <Minus size={16} />
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center text-slate-800 font-bold text-lg border-x-2 border-slate-200">
                      {quantity}
                    </span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                      disabled={quantity >= product.stock}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {inCart && (
                    <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                      <Check size={14} /> {inCart.quantity} in cart
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 ${
                  addedToCart
                    ? 'bg-emerald-600 text-white scale-95'
                    : product.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate('/cart'); }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button onClick={() => setWishlist(!wishlist)}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${wishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400'}`}>
                <Heart size={20} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
              <button className="w-14 h-14 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 flex items-center justify-center transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Free shipping over $75' },
                { icon: Shield, text: '2-year warranty included' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Icon size={15} className="text-emerald-600 shrink-0" />
                  <span className="text-xs text-slate-600 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <div className="flex gap-1">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {tab === 'reviews' ? `Reviews (${product.reviews_count.toLocaleString()})` : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mb-16">
          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed text-base">{product.description}</p>
              <p className="text-slate-600 leading-relaxed text-base mt-4">
                This {product.name} from {product.brand} represents the pinnacle of quality and craftsmanship in the {product.category.toLowerCase()} category.
                Designed for those who demand the best, it combines cutting-edge features with elegant design.
              </p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Brand', product.brand],
                ['Category', product.category],
                ['Subcategory', product.subcategory],
                ['Rating', `${product.rating} / 5.0`],
                ['Reviews', product.reviews_count.toLocaleString()],
                ['Stock', `${product.stock} units`],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl">
                  <span className="text-sm font-semibold text-slate-500">{key}</span>
                  <span className="text-sm font-bold text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl">
                <div className="text-center">
                  <div className="text-5xl font-black text-slate-800">{product.rating}</div>
                  <div className="flex gap-0.5 justify-center my-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= product.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />)}
                  </div>
                  <div className="text-slate-500 text-sm">{product.reviews_count.toLocaleString()} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(stars => {
                    const pct = stars === 5 ? 68 : stars === 4 ? 22 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-4">{stars}</span>
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-7">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-slate-400 text-sm text-center py-4">Detailed reviews coming soon.</p>
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
