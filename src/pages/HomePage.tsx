import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from '../components/products/ProductCard';

const heroSlides = [
  {
    title: 'Next-Level Electronics',
    subtitle: 'Discover cutting-edge technology that transforms the way you live and work',
    cta: 'Shop Electronics',
    category: 'Electronics',
    bg: 'from-slate-950 via-slate-900 to-emerald-950',
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Define Your Style',
    subtitle: 'Premium fashion pieces curated for those who know what they want',
    cta: 'Shop Fashion',
    category: 'Fashion',
    bg: 'from-slate-950 via-slate-900 to-slate-800',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Elevate Your Home',
    subtitle: 'Beautiful, functional pieces that turn any space into a sanctuary',
    cta: 'Shop Home',
    category: 'Home',
    bg: 'from-slate-950 via-slate-900 to-teal-950',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const categoryCards = [
  { name: 'Electronics', icon: '💻', image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=400', count: '6 products' },
  { name: 'Fashion', icon: '👗', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400', count: '4 products' },
  { name: 'Home', icon: '🏠', image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400', count: '4 products' },
  { name: 'Beauty', icon: '✨', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400', count: '3 products' },
  { name: 'Sports', icon: '🏃', image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400', count: '3 products' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $75' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      const [{ data: feat }, { data: newArr }] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true).limit(8),
        supabase.from('products').select('*').eq('is_new', true).limit(4),
      ]);
      setFeatured(feat || []);
      setNewArrivals(newArr || []);
      setLoading(false);
    };
    load();
  }, []);

  const slide = heroSlides[slideIndex];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`relative min-h-[600px] bg-gradient-to-r ${slide.bg} pt-32 pb-20 overflow-hidden transition-all duration-700`}>
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover opacity-20 transition-opacity duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              New Collection Available
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 transition-all duration-500">
              {slide.title}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg transition-all duration-500">
              {slide.subtitle}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/products?category=${slide.category}`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 hover:gap-3 shadow-lg shadow-emerald-900/30"
              >
                {slide.cta} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlideIndex(i)}
              className={`transition-all duration-300 rounded-full ${i === slideIndex ? 'w-6 h-2.5 bg-emerald-400' : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'}`} />
          ))}
        </div>
        <button onClick={() => setSlideIndex(i => (i - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setSlideIndex(i => (i + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{title}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-1">Browse By</p>
            <h2 className="text-3xl font-black text-slate-800">Shop Categories</h2>
          </div>
          <Link to="/products" className="text-slate-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1 transition-colors">
            All products <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryCards.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                <p className="text-white font-bold text-base">{cat.name}</p>
                <p className="text-emerald-300 text-xs font-medium mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-1">Hand Picked</p>
              <h2 className="text-3xl font-black text-slate-800">Featured Products</h2>
            </div>
            <Link to="/products?featured=true" className="text-slate-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1 transition-colors">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-slate-950 to-emerald-950 py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-amber-400 fill-amber-400" />)}
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Trusted by 50,000+ Customers</h2>
          <p className="text-slate-300 text-lg mb-8">
            Join our growing community of satisfied shoppers who trust NexusStore for premium products and exceptional service.
          </p>
          <button onClick={() => navigate('/products')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all duration-200 shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-500/20">
            Start Shopping
          </button>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-1">Just In</p>
              <h2 className="text-3xl font-black text-slate-800">New Arrivals</h2>
            </div>
            <Link to="/products?new=true" className="text-slate-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1 transition-colors">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
