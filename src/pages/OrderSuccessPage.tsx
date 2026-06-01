import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('orderId');
  const name = params.get('name') || 'Customer';
  const email = params.get('email') || '';
  const total = params.get('total') || '0.00';

  useEffect(() => {
    if (!orderId) navigate('/');
  }, [orderId, navigate]);

  const shortId = orderId ? orderId.split('-')[0].toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-28 pb-16 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Order Confirmed!</h1>
            <p className="text-emerald-100 text-base">Thank you, {name.split(' ')[0]}! Your order has been placed.</p>
          </div>

          <div className="p-8">
            {/* Order details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Order Number</p>
                <p className="text-lg font-black text-slate-800">{shortId}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Order Total</p>
                <p className="text-lg font-black text-emerald-600">${total}</p>
              </div>
            </div>

            {/* What happens next */}
            <h3 className="font-bold text-slate-800 mb-4">What happens next?</h3>
            <div className="space-y-3 mb-8">
              {[
                { icon: Mail, title: 'Confirmation email', desc: `A receipt has been sent to ${email}`, step: '1' },
                { icon: Package, title: 'Order processing', desc: 'Your items will be packed within 1-2 business days', step: '2' },
                { icon: ArrowRight, title: 'Shipping & delivery', desc: 'Estimated delivery in 3-7 business days', step: '3' },
              ].map(({ icon: Icon, title, desc, step }) => (
                <div key={step} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                Continue Shopping <ArrowRight size={16} />
              </Link>
              <Link to="/"
                className="flex-1 border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200">
                <Home size={16} /> Back to Home
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:hello@nexusstore.com" className="text-emerald-600 font-medium hover:underline">
            hello@nexusstore.com
          </a>
        </p>
      </div>
    </div>
  );
}
