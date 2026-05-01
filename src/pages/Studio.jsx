import React, { useState } from 'react';
import './Studio.css';

const Studio = () => {
  const [step, setStep] = useState(1); // 1: Booking, 2: Payment, 3: Receipt
  const [isProcessing, setIsProcessing] = useState(false);

  // Booking Details
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [receiptData, setReceiptData] = useState(null);

  // WhatsApp Admin
  const ADMIN_WHATSAPP = '60173168944';

  const packages = [
    { id: 1, title: 'Package 1', pax: 1, price: 100, icon: '🧑' },
    { id: 2, title: 'Package 2', pax: 2, price: 180, icon: '🧑‍🤝‍🧑' },
    { id: 3, title: 'Package 3', pax: 3, price: 250, icon: '👨‍👩‍👧' },
    { id: 4, title: 'Package 4', pax: 4, price: 300, icon: '👨‍👩‍👧‍👦' },
  ];

  const timeSlots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay();
    // 0 is Sunday
    if (day === 0) {
      alert('Sorry, the studio is closed on Sundays. Please select a date from Monday to Saturday.');
      setBookingDate('');
    } else {
      setBookingDate(e.target.value);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!selectedPackage || !bookingDate || !bookingTime) {
      return alert('Please select a package, date, and time to proceed.');
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateWhatsAppMessage = (orderId, pack) => {
    let message = `*NEW STUDIO BOOKING: ${orderId}*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${customerPhone}\n\n`;
    
    message += `*Booking Details:*\n`;
    message += `Package: ${pack.title} (${pack.pax} Person)\n`;
    message += `Date: ${bookingDate}\n`;
    message += `Time: ${bookingTime}\n\n`;

    message += `*Payment Details:*\n`;
    message += `Method: ${paymentMethod.toUpperCase()}\n`;
    message += `Total: RM ${pack.price.toFixed(2)}\n\n`;
    
    message += `_Sila semak resit bayaran sekiranya pelanggan menggunakan QR Pay / Bank Transfer / E-Wallet._`;

    return encodeURIComponent(message);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    const orderId = `STD-${Math.floor(Math.random() * 1000000)}`;
    const pack = packages.find(p => p.id === selectedPackage);

    setTimeout(() => {
      setIsProcessing(false);
      setReceiptData({
        orderId,
        date: new Date().toLocaleString(),
        package: pack,
        bookingDate,
        bookingTime,
        customerName,
        customerPhone,
        paymentMethod: paymentMethod.toUpperCase(),
        total: pack.price
      });
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="studio-page">
      {/* Hero Section */}
      <section className="studio-hero">
        <h1 className="animate-fade-up">Master the Art of Kuih Talam</h1>
        <p className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Join our premium studio sessions and learn the secrets of making authentic, delicious Kuih Talam from Monday to Saturday.
        </p>
      </section>

      <div className="studio-container animate-fade-in">
        
        {/* STEP 1: BOOKING DETAILS */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment}>
            <h2 className="studio-section-title">Select Your Package</h2>
            <div className="packages-grid">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <div className="package-icon">{pkg.icon}</div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <div className="package-price">RM {pkg.price}</div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>For {pkg.pax} Person{pkg.pax > 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>

            <h2 className="studio-section-title">Schedule Your Session</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <div className="studio-form-group">
                  <label className="studio-label">Select Date (Mon - Sat)</label>
                  <input 
                    type="date" 
                    className="studio-input" 
                    required 
                    value={bookingDate} 
                    onChange={handleDateChange} 
                    min={new Date().toISOString().split('T')[0]} // Cannot select past dates
                  />
                </div>
              </div>
              <div>
                <label className="studio-label" style={{ marginBottom: '1rem' }}>Select Time Slot</label>
                <div className="time-slots">
                  {timeSlots.map(time => (
                    <div 
                      key={time} 
                      className={`time-slot ${bookingTime === time ? 'selected' : ''}`}
                      onClick={() => setBookingTime(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="studio-section-title">Your Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="studio-form-group">
                <label className="studio-label">Full Name</label>
                <input type="text" className="studio-input" required placeholder="e.g. Ali Bin Abu" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="studio-form-group">
                <label className="studio-label">WhatsApp Number</label>
                <input type="tel" className="studio-input" required placeholder="e.g. 0123456789" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="studio-btn" disabled={!selectedPackage || !bookingDate || !bookingTime}>
              Proceed to Payment
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="studio-section-title">Complete Your Payment</h2>
              <p style={{ fontSize: '1.2rem', color: '#475569' }}>
                Total Amount: <strong style={{ color: '#059669', fontSize: '1.5rem' }}>RM {packages.find(p => p.id === selectedPackage)?.price.toFixed(2)}</strong>
              </p>
            </div>

            {!isProcessing ? (
              <>
                <div className="payment-methods">
                  <div className={`payment-method ${paymentMethod === 'qr' ? 'selected' : ''}`} onClick={() => setPaymentMethod('qr')}>QR Pay (DuitNow)</div>
                  <div className={`payment-method ${paymentMethod === 'fpx' ? 'selected' : ''}`} onClick={() => setPaymentMethod('fpx')}>FPX / Bank Transfer</div>
                  <div className={`payment-method ${paymentMethod === 'tng' ? 'selected' : ''}`} onClick={() => setPaymentMethod('tng')}>Touch 'n Go eWallet</div>
                  <div className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>Credit / Debit Card</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '2rem', textAlign: 'center' }}>
                  {paymentMethod === 'qr' && (
                    <>
                      <h3 style={{ color: '#E11D48', marginBottom: '1rem' }}>DUITNOW QR</h3>
                      <p>Scan the QR code below to complete your payment.</p>
                      <img src="/qr-code.jpg" alt="QR Code" style={{ width: '200px', margin: '1rem auto', borderRadius: '8px', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Reference: STUDIO KUIH TALAM</p>
                    </>
                  )}
                  {paymentMethod === 'fpx' && (
                    <>
                      <h3 style={{ color: '#F59E0B' }}>MAYBANK</h3>
                      <h2 style={{ letterSpacing: '2px', margin: '1rem 0' }}>1140 1234 5678</h2>
                      <p><strong>Noni Talam Enterprise</strong></p>
                    </>
                  )}
                  {paymentMethod === 'tng' && (
                    <>
                      <h3 style={{ color: '#0284C7' }}>TOUCH 'N GO</h3>
                      <p>Send your payment to our business number:</p>
                      <h2 style={{ margin: '1rem 0' }}>017-316 8944</h2>
                    </>
                  )}
                  {paymentMethod === 'card' && (
                    <div style={{ background: '#FEF3C7', color: '#92400E', padding: '1rem', borderRadius: '8px' }}>
                      <p>Card payment gateway requires integration. Please use QR Pay, FPX, or TnG for now.</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(1)} className="studio-btn" style={{ background: '#94A3B8', flex: 1 }}>Back</button>
                  <button type="button" onClick={handleCompletePayment} className="studio-btn" style={{ flex: 2 }} disabled={paymentMethod === 'card'}>
                    Confirm & Get Receipt
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                 <div style={{ width: '50px', height: '50px', border: '4px solid #DFE6E1', borderTop: '4px solid #10B981', borderRadius: '50%', animation: 'spin-slow 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
                 <h3>Processing your booking...</h3>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: RECEIPT */}
        {step === 3 && receiptData && (
          <div className="studio-receipt animate-fade-in">
            <div className="receipt-header">
              <h2>Booking Confirmed!</h2>
              <p>Thank you for choosing Studio Noni Talam</p>
            </div>
            
            <div className="receipt-body">
              <div style={{ marginBottom: '2rem' }}>
                <div className="receipt-row">
                  <span style={{ color: '#64748b' }}>Booking ID:</span>
                  <strong>{receiptData.orderId}</strong>
                </div>
                <div className="receipt-row">
                  <span style={{ color: '#64748b' }}>Booking Date:</span>
                  <strong>{receiptData.date}</strong>
                </div>
                <div className="receipt-row">
                  <span style={{ color: '#64748b' }}>Payment Method:</span>
                  <strong>{receiptData.paymentMethod}</strong>
                </div>
              </div>

              <h3 style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Session Details</h3>
              <div className="receipt-row">
                <span>Class Package:</span>
                <strong>{receiptData.package.title} ({receiptData.package.pax} Person)</strong>
              </div>
              <div className="receipt-row">
                <span>Session Date:</span>
                <strong>{receiptData.bookingDate}</strong>
              </div>
              <div className="receipt-row">
                <span>Session Time:</span>
                <strong>{receiptData.bookingTime}</strong>
              </div>
              <div className="receipt-row">
                <span>Customer Name:</span>
                <strong>{receiptData.customerName}</strong>
              </div>

              <div className="receipt-total">
                <span>Total Paid</span>
                <span className="amount">RM {receiptData.total.toFixed(2)}</span>
              </div>

              <div style={{ background: '#ECFDF5', padding: '1.5rem', borderRadius: '8px', border: '1px solid #10B981', marginTop: '2rem', textAlign: 'center' }}>
                <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>Final Step!</h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#065F46' }}>
                  Please send your receipt to our WhatsApp to finalize your studio booking.
                </p>
                <a 
                  href={`https://wa.me/${ADMIN_WHATSAPP}?text=${generateWhatsAppMessage(receiptData.orderId, receiptData.package)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="studio-btn"
                  style={{ textDecoration: 'none', display: 'inline-block', background: '#25D366' }}
                >
                  Send Receipt via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Studio;
