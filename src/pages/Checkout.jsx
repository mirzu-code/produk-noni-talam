import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, getCartTotal, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const [step, setStep] = useState(1); // 1: Cart & Details, 2: Payment Gateway, 3: Receipt
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [deliveryMethod, setDeliveryMethod] = useState('self_collect');
  const [deliveryRegion, setDeliveryRegion] = useState('');

  // Noni Talam Admin WhatsApp Number (Gantikan dengan nombor sebenar anda)
  const ADMIN_WHATSAPP = '60183168944';

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    countryCode: '+60'
  });

  const [receiptData, setReceiptData] = useState(null);

  const handleInputChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty!');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDeliveryFee = () => {
    if (deliveryMethod === 'self_collect') return 0;
    if (deliveryRegion === 'peninsular') return 5;
    if (deliveryRegion === 'sabah_sarawak') return 10;
    if (deliveryRegion === 'other') return 20;
    return 0;
  };

  const generateWhatsAppMessage = (orderId, total, deliveryFee) => {
    let message = `*NEW ORDER: ${orderId}*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.countryCode} ${customerDetails.phone}\n`;
    message += `Delivery Method: ${deliveryMethod === 'self_collect' ? 'Self Collect' : 'Delivery'}\n`;

    if (deliveryMethod === 'delivery') {
      let regionText = '';
      if (deliveryRegion === 'peninsular') regionText = 'Peninsular Malaysia';
      else if (deliveryRegion === 'sabah_sarawak') regionText = 'Sabah & Sarawak';
      else if (deliveryRegion === 'other') regionText = 'Other Country';
      message += `Region: ${regionText}\n`;
      message += `Address: ${customerDetails.address}\n`;
      message += `Delivery Fee: RM ${deliveryFee.toFixed(2)}\n\n`;
    } else {
      message += `\n`;
    }

    message += `*Order Items:*\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (RM ${(item.price * item.quantity).toFixed(2)})\n`;
    });

    message += `\n*Payment Method:* ${paymentMethod.toUpperCase()}\n`;
    message += `*TOTAL PENDING: RM ${total.toFixed(2)}*\n\n`;
    message += `_Sila semak resit bayaran sekiranya pelanggan menggunakan QR Pay / Bank Transfer._`;

    return encodeURIComponent(message);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    const subTotal = getCartTotal();
    const deliveryFee = getDeliveryFee();
    const total = subTotal + deliveryFee;

    setTimeout(() => {
      setIsProcessing(false);
      setReceiptData({
        orderId: orderId,
        date: new Date().toLocaleString(),
        customer: { ...customerDetails },
        deliveryMethod,
        deliveryRegion,
        deliveryFee,
        items: [...cart],
        subTotal,
        total: total,
        method: paymentMethod.toUpperCase()
      });

      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const renderCartItems = () => (
    <div style={{ background: 'var(--color-bg)', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-bg-subtle)', paddingBottom: '0.5rem' }}>Order Summary</h3>
      {cart.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Your cart is empty. <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Go to Store</Link></p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{item.name}</h4>
                  <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>RM {item.price.toFixed(2)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.2rem 0.6rem', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>-</button>
                  <span style={{ padding: '0 0.8rem' }}>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.2rem 0.6rem', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>+</button>
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)} style={{ color: '#E63946', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid var(--color-bg-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              <span>Subtotal:</span>
              <span>RM {getCartTotal().toFixed(2)}</span>
            </div>
            {deliveryMethod === 'delivery' && deliveryRegion && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                <span>Delivery Fee:</span>
                <span>RM {getDeliveryFee().toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--color-accent)' }}>RM {(getCartTotal() + getDeliveryFee()).toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: '3rem 2rem', minHeight: '80vh' }}>

      {/* STEP 1: CART & DETAILS */}
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Checkout</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '3rem', alignItems: 'start' }}>

            {/* Details Form */}
            <div style={{ background: 'var(--color-bg)', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Shipping Details</h3>
              <form onSubmit={handleProceedToPayment}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" required value={customerDetails.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number (WhatsApp Active)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select name="countryCode" className="form-control" style={{ width: '130px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} value={customerDetails.countryCode} onChange={handleInputChange}>
                      <option value="+60">🇲🇾 +60 (MY)</option>
                      <option value="+65">🇸🇬 +65 (SG)</option>
                      <option value="+62">🇮🇩 +62 (ID)</option>
                      <option value="+673">🇧🇳 +673 (BN)</option>
                    </select>
                    <input type="tel" name="phone" className="form-control" style={{ flex: 1 }} required value={customerDetails.phone} onChange={handleInputChange} placeholder="e.g. 123456789" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Delivery Method</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="deliveryMethod" value="self_collect" checked={deliveryMethod === 'self_collect'} onChange={() => setDeliveryMethod('self_collect')} /> Self Collect
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} /> Delivery
                    </label>
                  </div>
                </div>

                {deliveryMethod === 'delivery' && (
                  <>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Delivery Region</label>
                      <select className="form-control" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} value={deliveryRegion} onChange={(e) => setDeliveryRegion(e.target.value)} required>
                        <option value="" disabled>Select Region</option>
                        <option value="peninsular">Peninsular Malaysia</option>
                        <option value="sabah_sarawak">Sabah and Sarawak</option>
                        <option value="other">Other Country</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Delivery Address</label>
                      <textarea name="address" className="form-control" rows="3" required value={customerDetails.address} onChange={handleInputChange}></textarea>
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }} disabled={cart.length === 0}>
                  Proceed to Payment
                </button>
              </form>
            </div>

            {renderCartItems()}

          </div>
        </>
      )}

      {/* STEP 2: PAYMENT GATEWAY (REAL QR + WHATSAPP SYSTEM) */}
      {step === 2 && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-bg)', padding: '3rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-primary)' }}>Secure Payment</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Amount to pay: <strong style={{ color: 'var(--color-accent)', fontSize: '1.2rem' }}>RM {(getCartTotal() + getDeliveryFee()).toFixed(2)}</strong></p>
          </div>

          {!isProcessing ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <button type="button" onClick={() => setPaymentMethod('qr')} style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'qr' ? 'var(--color-primary)' : '#ddd'}`, borderRadius: '8px', background: paymentMethod === 'qr' ? '#f0fdf4' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  QR Pay (DuitNow)
                </button>
                <button type="button" onClick={() => setPaymentMethod('fpx')} style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'fpx' ? 'var(--color-primary)' : '#ddd'}`, borderRadius: '8px', background: paymentMethod === 'fpx' ? '#f0fdf4' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  FPX / Bank Transfer
                </button>
                <button type="button" onClick={() => setPaymentMethod('card')} style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'card' ? 'var(--color-primary)' : '#ddd'}`, borderRadius: '8px', background: paymentMethod === 'card' ? '#f0fdf4' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  Visa / Mastercard
                </button>
                <button type="button" onClick={() => setPaymentMethod('ewallet')} style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'ewallet' ? 'var(--color-primary)' : '#ddd'}`, borderRadius: '8px', background: paymentMethod === 'ewallet' ? '#f0fdf4' : 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                  E-Wallet (TnG)
                </button>
              </div>

              {/* REAL QR PAY INTEGRATION */}
              {paymentMethod === 'qr' && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #eee', textAlign: 'center' }}>
                  <h4 style={{ color: '#E11D48', marginBottom: '1rem' }}>MALAYSIA NATIONAL QR</h4>
                  <p style={{ marginBottom: '1rem' }}>Sila scan QR code di bawah menggunakan aplikasi perbankan anda atau E-Wallet.</p>

                  {/* The image points to /qr-code.jpg in the public folder */}
                  <img src="/qr-code.jpg" alt="DuitNow QR Code" style={{ width: '250px', maxWidth: '100%', height: 'auto', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '1rem' }} />

                  <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'inline-block', textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Reference:</strong> NONI TALAM ORDER</p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Amount:</strong> RM {(getCartTotal() + getDeliveryFee()).toFixed(2)}</p>
                  </div>

                  <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>Selepas berjaya bayar, tekan butang di bawah untuk hantar resit anda ke WhatsApp kami.</p>
                </div>
              )}

              {paymentMethod === 'fpx' && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #eee', textAlign: 'center' }}>
                  <p style={{ marginBottom: '1rem' }}>Sila buat pemindahan bank ke akaun berikut:</p>
                  <h4 style={{ color: 'var(--color-primary)' }}>MAYBANK</h4>
                  <h3 style={{ letterSpacing: '2px', margin: '0.5rem 0' }}>1140 1234 5678</h3>
                  <p><strong>Noni Talam Enterprise</strong></p>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Sila sertakan resit pemindahan melalui WhatsApp selepas menekan butang lengkap.</p>
                </div>
              )}

              {(paymentMethod === 'card' || paymentMethod === 'ewallet') && (
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff3cd', color: '#856404', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center' }}>
                  <p><strong>Perhatian:</strong> Gateway automatik (Visa/Mastercard) memerlukan integrasi seperti Stripe/SenangPay. Buat masa ini, sila gunakan <strong>QR Pay</strong> atau <strong>FPX Manual</strong>.</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" style={{ flex: 2, fontSize: '1.1rem', backgroundColor: '#25D366', borderColor: '#25D366' }} onClick={handleProcessPayment} disabled={paymentMethod === 'card' || paymentMethod === 'ewallet'}>
                  Complete & Send via WhatsApp
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '50px', height: '50px', border: '4px solid #DFE6E1', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
              <h3>Generating Order & Opening WhatsApp...</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Sila hantar mesej yang dijana kepada kami berserta resit anda.</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: OFFICIAL RECEIPT */}
      {step === 3 && receiptData && (
        <div className="animate-fade-up" style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '0', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

          <div style={{ background: 'var(--color-primary)', color: 'white', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', color: 'white' }}>✓</div>
            <h2 style={{ color: 'white', margin: 0 }}>Order Submitted!</h2>
            <p style={{ opacity: 0.8, margin: 0 }}>Sila pastikan anda menekan "Send" di WhatsApp berserta resit anda.</p>
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ borderBottom: '1px dashed #ccc', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
                <strong>{receiptData.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
                <strong>{receiptData.date}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Payment Method:</span>
                <strong>{receiptData.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery:</span>
                <strong>{receiptData.deliveryMethod === 'self_collect' ? 'Self Collect' : 'Delivery'}</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #ccc', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Items Ordered</h4>
              {receiptData.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {receiptData.deliveryMethod === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                  <span>Delivery Fee</span>
                  <span>RM {receiptData.deliveryFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '1rem', borderRadius: '6px' }}>
              <span style={{ fontWeight: 'bold' }}>To Pay</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--color-primary)' }}>
                RM {receiptData.total.toFixed(2)}
              </span>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>

              <div style={{ background: '#e6ffe6', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '2px solid #25D366' }}>
                <h3 style={{ color: '#075E54', marginBottom: '0.5rem' }}>Langkah Terakhir!</h3>
                <p style={{ fontSize: '0.9rem', color: '#128C7E', marginBottom: '1rem' }}>Sila tekan butang di bawah untuk menghantar salinan bil beserta resit bayaran anda kepada WhatsApp Admin untuk pengesahan pesanan.</p>
                <a
                  href={`https://wa.me/${ADMIN_WHATSAPP}?text=${generateWhatsAppMessage(receiptData.orderId, receiptData.total, receiptData.deliveryFee)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'block', width: '100%', backgroundColor: '#25D366', borderColor: '#25D366', fontSize: '1.1rem', padding: '1rem', fontWeight: 'bold' }}
                >
                  Hantar Pesanan Ke WhatsApp
                </a>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.8rem' }} onClick={() => window.print()}>
                  Print Receipt
                </button>
                <Link to="/" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.8rem', backgroundColor: '#f1f5f9' }} onClick={() => setStep(1)}>
                  Tutup
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Checkout;
