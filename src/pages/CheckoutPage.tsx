import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { CheckoutFormData } from '../lib/types';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

function formatCard(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const shipping = subtotal >= 75 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState<CheckoutFormData>({
    name: '', email: '', address: '', city: '', state: 'CA', zip: '',
    cardNumber: '', cardExpiry: '', cardCvc: '',
  });

  const set = (k: keyof CheckoutFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let val = e.target.value;
    if (k === 'cardNumber') val = formatCard(val);
    if (k === 'cardExpiry') val = formatExpiry(val);
    if (k === 'cardCvc') val = val.replace(/\D/g, '').slice(0, 4);
    setForm(f => ({ ...f, [k]: val }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.address.trim() || !form.city.trim() || !form.zip.trim()) return 'Please fill in all shipping fields.';
    if (!form.email.includes('@')) return 'Please enter a valid email address.';
    if (form.cardNumber.replace(/\s/g, '').length < 16) return 'Please enter a valid 16-digit card number.';
    if (form.cardExpiry.length < 5) return 'Please enter a valid expiry date (MM/YY).';
    if (form.cardCvc.length < 3) return 'Please enter a valid CVV (3-4 digits).';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    if (items.length === 0) { navigate('/products'); return; }

    setError('');
    setLoading(true);

    try {
      const sessionToken = crypto.randomUUID();
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        session_token: sessionToken,
        status: 'confirmed',
        subtotal,
        shipping,
        tax,
        total,
        shipping_name: form.name,
        shipping_email: form.email,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_zip: form.zip,
      }).select().maybeSingle();

      if (orderErr || !order) throw new Error(orderErr?.message || 'Failed to create order');

      await supabase.from('order_items').insert(
        items.map(i => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          product_image: i.product.image_url,
          quantity: i.quantity,
          price: i.product.price,
        }))
      );

      clearCart();
      navigate(`/order-success?orderId=${order.id}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&total=${total.toFixed(2)}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <Lock size={18} className="text-emerald-600" />
          <h1 className="text-2xl font-black text-slate-800">Secure Checkout</h1>
        </div>

        {/* Mobile order summary toggle */}
        <button onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
          className="lg:hidden w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 text-sm font-semibold text-slate-700">
          <span>Order Summary ({items.length} items) — ${total.toFixed(2)}</span>
          {orderSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0">!</span>
                {error}
              </div>
            )}

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full text-xs font-black flex items-center justify-center">1</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input value={form.name} onChange={set('name')} placeholder="John Doe" required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                  <input value={form.email} onChange={set('email')} type="email" placeholder="john@example.com" required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Street Address *</label>
                  <input value={form.address} onChange={set('address')} placeholder="123 Main Street, Apt 4B" required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">City *</label>
                  <input value={form.city} onChange={set('city')} placeholder="San Francisco" required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">State *</label>
                    <select value={form.state} onChange={set('state')}
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 bg-white">
                      {US_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">ZIP *</label>
                    <input value={form.zip} onChange={set('zip')} placeholder="94102" maxLength={10} required
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full text-xs font-black flex items-center justify-center">2</span>
                Payment Details
              </h2>
              <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                <Lock size={12} />
                <span>Your payment info is encrypted and secure. This is a demo — no real charges apply.</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Card Number *</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={form.cardNumber} onChange={set('cardNumber')} placeholder="1234 5678 9012 3456"
                      className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Expiry Date *</label>
                    <input value={form.cardExpiry} onChange={set('cardExpiry')} placeholder="MM/YY"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">CVV *</label>
                    <input value={form.cardCvc} onChange={set('cardCvc')} placeholder="123" type="password"
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors text-slate-800 font-mono" />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-black py-5 rounded-xl text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-xl hover:shadow-2xl">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Place Order — ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className={`lg:block ${orderSummaryOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-5">Your Order</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img src={`${product.image_url}?auto=compress&cs=tinysrgb&w=100`} alt="" className="w-14 h-14 object-cover rounded-lg bg-slate-50" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">${product.price.toFixed(2)} each</p>
                    </div>
                    <p className="text-sm font-bold text-slate-800 shrink-0">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span><span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-dashed border-slate-200 pt-3 flex justify-between font-black text-slate-800">
                  <span>Total</span><span className="text-emerald-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Check size={12} className="text-emerald-500" />
                30-day free returns
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <Check size={12} className="text-emerald-500" />
                Secure SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
