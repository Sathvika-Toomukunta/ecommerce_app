import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Nexus<span className="text-emerald-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Premium products for modern living. Curated quality, delivered to your door with care.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Shop</h3>
            <ul className="space-y-3 text-sm">
              {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat.split(' ')[0]}`} className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
              <li><Link to="/products" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">All Products</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Help</h3>
            <ul className="space-y-3 text-sm">
              {['FAQ', 'Shipping & Returns', 'Order Tracking', 'Size Guide', 'Contact Us', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>123 Commerce Ave<br />San Francisco, CA 94102</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-emerald-400 shrink-0" />
                <span>+1 (888) 555-0123</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-emerald-400 shrink-0" />
                <span>hello@nexusstore.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Newsletter</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Enter email" className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2.5 rounded-lg transition-colors">
                  <Mail size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NexusStore. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">Secure & encrypted payments</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(m => (
              <span key={m} className="bg-slate-800 px-2 py-1 rounded font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
