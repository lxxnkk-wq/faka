import React, { useEffect, useState } from 'react';
import { CreditCard, Globe, Lock } from 'lucide-react';
import { LuxuryCaptcha } from '../components/LuxuryCaptcha';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import { ApiOrder, CartItem } from '../types';
import { api } from '../utils/api';

interface PaymentCreateResult {
  pay_url?: string;
  payment_id?: number;
}

export const CheckoutPage = ({ cart }: { cart: CartItem[] }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { config } = useSite();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = 0;
  const total = subtotal + fee;

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [paymentChannelId, setPaymentChannelId] = useState<number | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    if (!paymentChannelId && config?.payment_channels?.length) {
      setPaymentChannelId(config.payment_channels[0].id);
    }
  }, [config, paymentChannelId]);

  const buildItems = () =>
    cart.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      fulfillment_type: item.deliveryType,
    }));

  const redirectToPaymentOrOrder = (
    order: ApiOrder,
    payment: PaymentCreateResult | null,
    guestEmail?: string,
  ) => {
    clearCart();
    if (payment?.pay_url) {
      window.location.href = payment.pay_url;
      return;
    }
    if (guestEmail) {
      window.location.href = `/lookup?order_no=${encodeURIComponent(order.order_no)}&email=${encodeURIComponent(guestEmail)}`;
      return;
    }
    window.location.href = '/orders';
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!user && !email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    if (!user && !password.trim()) {
      alert('Please set an order password for guest lookup.');
      return;
    }
    if (config?.captcha?.scenes?.guest_create_order && !captchaVerified) {
      alert('Please complete the human verification.');
      return;
    }

    setIsProcessing(true);
    try {
      if (user) {
        const orderRes = await api.post<ApiOrder>('/orders', {
          items: buildItems(),
        });

        let payment: PaymentCreateResult | null = null;
        if (paymentChannelId) {
          const paymentRes = await api.post<PaymentCreateResult>('/payments', {
            order_id: orderRes.data.id,
            channel_id: paymentChannelId,
            use_balance: false,
          });
          payment = paymentRes.data;
        }

        redirectToPaymentOrOrder(orderRes.data, payment);
        return;
      }

      const orderRes = await api.post<ApiOrder>('/guest/orders', {
        email: email.trim(),
        order_password: password.trim(),
        items: buildItems(),
      });

      let payment: PaymentCreateResult | null = null;
      if (paymentChannelId) {
        const paymentRes = await api.post<PaymentCreateResult>('/guest/payments', {
          email: email.trim(),
          order_password: password.trim(),
          order_id: orderRes.data.id,
          channel_id: paymentChannelId,
        });
        payment = paymentRes.data;
      }

      redirectToPaymentOrOrder(orderRes.data, payment, email.trim());
    } catch (error: any) {
      console.error('Checkout failed:', error);
      alert(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-8 md:px-16 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Secure Checkout</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Nova Collective Verified Transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">01. Delivery Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <input
                type="email"
                placeholder="EMAIL ADDRESS FOR DELIVERY"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={Boolean(user)}
                className="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:outline-none focus:border-brand transition-colors disabled:opacity-60"
              />
            </div>
            {!user && (
              <div className="pt-4">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-4">
                  Set a password to track this order later
                </p>
                <input
                  type="password"
                  placeholder="ORDER LOOKUP PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full md:w-1/2 bg-transparent border-b border-white/10 py-3 text-xs focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">02. Payment Method</h2>
            {config?.payment_channels?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.payment_channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setPaymentChannelId(channel.id)}
                    className={`p-6 border rounded-xl flex items-center gap-4 group text-left transition-all ${
                      paymentChannelId === channel.id ? 'border-brand bg-brand/5' : 'border-white/10 hover:border-brand'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        paymentChannelId === channel.id ? 'bg-brand/10' : 'bg-white/5 group-hover:bg-brand/10'
                      }`}
                    >
                      {channel.provider_type === 'crypto' ? (
                        <Globe
                          size={24}
                          className={paymentChannelId === channel.id ? 'text-brand' : 'text-white/20 group-hover:text-brand'}
                        />
                      ) : (
                        <CreditCard
                          size={24}
                          className={paymentChannelId === channel.id ? 'text-brand' : 'text-white/20 group-hover:text-brand'}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest uppercase">{channel.name}</p>
                      <p className="text-[9px] text-white/30">Fee: {(Number.parseFloat(channel.fee_rate) * 100).toFixed(1)}%</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-white/10 rounded-xl text-xs text-white/40 leading-relaxed">
                No payment channels are configured yet. You can still create an order now and finish payment after adding a
                channel in the admin panel.
              </div>
            )}
          </div>

          {config?.captcha?.scenes?.guest_create_order && !user && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-brand">03. Verification</h2>
              <LuxuryCaptcha onVerify={setCaptchaVerified} />
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">Review Collection</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="w-16 h-16 bg-neutral-900 rounded overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-serif italic">{item.name}</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">
                      {item.category} Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-display font-light">
                    {config?.currency}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-2xl space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                <span className="font-display">
                  {config?.currency}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Processing Fee</span>
                <span className="font-display">
                  {config?.currency}
                  {fee.toLocaleString()}
                </span>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Value</span>
                  <p className="text-[8px] text-white/20 mt-1 uppercase">Inclusive of all digital taxes</p>
                </div>
                <span className="text-3xl font-display font-light gold-gradient">
                  {config?.currency}
                  {total.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
              className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl shadow-brand/20 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Acquisition'}
            </button>
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                <Lock size={12} /> SSL Encrypted Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
