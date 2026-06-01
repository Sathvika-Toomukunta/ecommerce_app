import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronDown, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoryDropdown(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (cat: string) => {
    navigate(`/products?category=${cat}`);
    setCategoryDropdown(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950 shadow-2xl' : 'bg-slate-950'
    }`}>
      {/* Announcement bar */}
      <div className="bg-emerald-600 text-white text-center text-xs py-2 font-medium tracking-wide">
        Free shipping on orders over $75 &nbsp;|&nbsp; Use code <span className="font-bold">SAVE10</span> for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Nexus<span className="text-emerald-400">Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-800">
              Home
            </Link>

            <div className="relative" onMouseEnter={() => setCategoryDropdown(true)} onMouseLeave={() => setCategoryDropdown(false)}>
              <button className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-800">
                Categories <ChevronDown size={14} className={`transition-transform ${categoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {categoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium transition-colors">
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-800">
              All Products
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-slate-800 text-white placeholder-slate-400 text-sm px-4 py-2 rounded-l-lg outline-none border border-slate-700 focus:border-emerald-500 w-56 transition-colors"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-r-lg transition-colors">
                  <Search size={16} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 text-slate-400 hover:text-white p-2 transition-colors">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <Search size={20} />
              </button>
            )}

            <button className="hidden sm:flex text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
              <Heart size={20} />
            </button>

            <button className="hidden sm:flex text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
              <User size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg transition-colors ml-1">
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors ml-1">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">Home</Link>
            <Link to="/products" className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">All Products</Link>
            <div className="pt-2 pb-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-1">Categories</p>
              {categories.map(cat => (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  className="w-full text-left text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
