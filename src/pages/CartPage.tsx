import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Looks like you haven't added anything yet. Discover our amazing products!</p>
          <button onClick={() => navigate('/products')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-800">Shopping Cart</h1>
          <button onClick={clearCart} className="text-sm text-slate-400 hover:text-red-500 font-medium transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-slate-100 hover:border-slate-200 transition-colors group">
                <Link to={`/products/${product.id}`} className="shrink-0">
                  <img
                    src={`${product.image_url}?auto=compress&cs=tinysrgb&w=200`}
                    alt={product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-slate-50 group-hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">{product.brand}</p>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug hover:text-emerald-700 transition-colors line-clamp-2">{product.name}</h3>
                      </Link>
                    </div>
                    <button onClick={() => removeFromCart(product.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                        disabled={quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-slate-800 font-bold border-x-2 border-slate-200 text-sm">
                        {quantity}
                      </span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                        disabled={quantity >= product.stock}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 text-lg">${(product.price * quantity).toFixed(2)}</p>
                      {quantity > 1 && <p className="text-xs text-slate-400">${product.price.toFixed(2)} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="font-bold text-slate-800 text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
                </div>
                {subtotal < 75 && (
                  <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-700 font-medium">
                    Add ${(75 - subtotal).toFixed(2)} more to get free shipping!
                  </div>
                )}
              </div>

              <div className="border-t-2 border-dashed border-slate-200 pt-4 mb-6">
                <div className="flex justify-between text-base font-black text-slate-800">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Promo code"
                      className="w-full pl-8 pr-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:gap-3"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link to="/products" className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mt-3 py-2 transition-colors">
                Continue Shopping
              </Link>

              <div className="mt-4 flex items-center justify-center gap-3 text-slate-400">
                {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(m => (
                  <span key={m} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs font-medium">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
