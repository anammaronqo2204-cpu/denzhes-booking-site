import { useState } from 'react';
import type { Service, ServiceVariant } from '../data/services';
import { compressImage, createReference, durationToMinutes, type Booking } from '../data/adminStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  selectedVariant?: ServiceVariant;
  bookings: Booking[];
  onBookingCreated: (booking: Booking) => void;
}

export default function BookingModal({ isOpen, onClose, service, selectedVariant, bookings, onBookingCreated }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
  });
  const [stylePhoto, setStylePhoto] = useState('');
  const [stylePhotoName, setStylePhotoName] = useState('');
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !service) return null;

  const price = selectedVariant ? selectedVariant.price : service.price;
  const sizeLabel = selectedVariant ? ` (${selectedVariant.label})` : '';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const id = createReference();
    onBookingCreated({
      id,
      type: 'salon',
      clientName: formData.name,
      phone: formData.phone,
      serviceId: service.id,
      serviceName: service.name,
      variant: selectedVariant?.label,
      price: Number(price || 0),
      date: formData.date,
      time: formData.time,
      duration: service.duration,
      notes: formData.notes,
      stylePhoto,
      stylePhotoName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setReference(id);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: '', phone: '', date: '', time: '', notes: '' });
    setStylePhoto('');
    setStylePhotoName('');
    setReference('');
    onClose();
  };

  const isFormValid = formData.name && formData.phone && formData.date && formData.time;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-32 overflow-hidden">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-white text-xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {service.name}{sizeLabel}
            </h2>
            <p className="text-white/80 text-sm">{service.duration} · R{price}</p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 px-6 pt-5">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-1 flex-1 rounded-full transition-colors ${
                step >= s ? 'bg-blush' : 'bg-soft-border'
              }`} />
            </div>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-gray font-medium mb-4">Your Details</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-soft-border bg-cream/50 focus:outline-none focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">WhatsApp / Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0XX XXX XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-soft-border bg-cream/50 focus:outline-none focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Style reference</label>
                <label className="relative block cursor-pointer border border-dashed border-soft-border bg-cream/50 px-4 py-4 text-sm text-warm-gray hover:border-blush transition-colors">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async event => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setStylePhotoName(file.name);
                    setStylePhoto(await compressImage(file));
                  }} />
                  {stylePhotoName || 'Choose a photo from your gallery'}
                </label>
                <p className="mt-1.5 text-[10px] leading-relaxed text-warm-gray">Denzhe uses this to review your look and prepare supplies before the appointment.</p>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone}
                className="w-full py-3 rounded-xl bg-blush text-white font-medium text-sm hover:bg-blush-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-gray font-medium mb-4">Pick Your Slot</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value, time: '' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-soft-border bg-cream/50 focus:outline-none focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => {
                    const toMinutes = (value: string) => { const [hours, minutes] = value.split(':').map(Number); return hours * 60 + minutes; };
                    const start = toMinutes(t);
                    const end = start + durationToMinutes(service.duration);
                    const reserved = bookings.some(booking => {
                      if (booking.date !== formData.date || !booking.time || booking.status === 'declined') return false;
                      const bookedStart = toMinutes(booking.time);
                      const bookedEnd = bookedStart + durationToMinutes(booking.duration);
                      return start < bookedEnd && end > bookedStart;
                    });
                    return <button
                      key={t}
                      disabled={reserved || !formData.date}
                      onClick={() => setFormData({ ...formData, time: t })}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.time === t
                          ? 'bg-blush text-white shadow-md shadow-blush/25'
                          : reserved ? 'bg-stone-200 border border-stone-200 text-stone-400 line-through cursor-not-allowed' : 'bg-cream border border-soft-border text-charcoal hover:border-blush disabled:opacity-40'
                      }`}
                    >
                      {reserved ? 'Booked' : t}
                    </button>;
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special requests..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-soft-border bg-cream/50 focus:outline-none focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-cream rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Service</span>
                  <span className="font-medium text-charcoal">{service.name}{sizeLabel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Duration</span>
                  <span className="font-medium text-charcoal">{service.duration}</span>
                </div>
                {formData.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Date</span>
                    <span className="font-medium text-charcoal">
                      {new Date(formData.date + 'T00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                {formData.time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Time</span>
                    <span className="font-medium text-charcoal">{formData.time}</span>
                  </div>
                )}
                <div className="border-t border-soft-border pt-2 mt-2 flex justify-between">
                  <span className="font-medium text-charcoal">Total</span>
                  <span className="text-lg font-bold text-blush-dark">R{price}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-soft-border text-charcoal font-medium text-sm hover:bg-cream transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="flex-[2] py-3 rounded-xl bg-blush text-white font-medium text-sm hover:bg-blush-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending RSVP...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-16 h-16 bg-blush-light rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blush-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Your RSVP has been sent
                </h3>
                <p className="text-warm-gray text-sm mt-2">
                  Your RSVP for <strong>{service.name}{sizeLabel}</strong> has been sent.
                </p>
                <p className="text-warm-gray text-sm mt-1">
                  Denzhe will reach out on WhatsApp with payment details.
                </p>
              </div>
              <div className="bg-cream rounded-xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">Reference</span>
                  <span className="font-mono font-medium text-charcoal">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">Client</span>
                  <span className="font-medium text-charcoal">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">Service</span>
                  <span className="font-medium text-charcoal">{service.name}{sizeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">Amount</span>
                  <span className="font-bold text-blush-dark">R{price}</span>
                </div>
              </div>
              <a
                href="https://wa.me/27663773941"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blush-dark text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <button
                onClick={handleClose}
                className="block w-full py-3 rounded-xl border border-soft-border text-charcoal font-medium text-sm hover:bg-cream transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
