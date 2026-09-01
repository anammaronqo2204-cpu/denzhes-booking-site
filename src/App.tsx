import { useEffect, useState } from 'react';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import ServiceBubble from './components/ServiceBubble';
import { categories } from './data/services';
import type { Service, ServiceVariant } from './data/services';
import {
  compressImage,
  createReference,
  loadBookings,
  loadServices,
  loadSettings,
  phoneToWhatsApp,
  saveBookings,
  saveServices,
  saveSettings,
  type Booking,
  type BusinessSettings,
} from './data/adminStore';

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Header({ onMobile, onAdmin }: { onMobile: () => void; onAdmin: () => void }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header ${solid ? 'site-header--solid' : ''}`}>
      <a className="brand" href="#top" aria-label="Denzhe's Beauty Bar home"><span className="brand-mark">D</span><span>Denzhe's <i>Beauty Bar</i></span></a>
      <nav className={open ? 'nav nav--open' : 'nav'}>
        <a href="#ritual" onClick={() => setOpen(false)}>How it works</a>
        <a href="#services" onClick={() => setOpen(false)}>Services</a>
        <button onClick={() => { onMobile(); setOpen(false); }}>Beauty Mobile</button>
        <button onClick={() => { onAdmin(); setOpen(false); }}>Staff portal</button>
        <a className="nav-book" href="#services" onClick={() => setOpen(false)}>Reserve a moment</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Open menu"><span /><span /></button>
    </header>
  );
}

function Hero({ onBook, onMobile, settings }: { onBook: () => void; onMobile: () => void; settings: BusinessSettings }) {
  return (
    <section className="hero" id="top">
      <div className="hero-photo" aria-hidden="true"><img src="/images/salon-welcome.jpg" alt="" /></div>
      <div className="hero-wash" />
      <div className="hero-inner">
        <div className="hero-kickers reveal"><span>Boutique hair & nail studio</span><span>Deposit-secured slots</span><button onClick={onMobile}>Beauty Mobile house calls</button></div>
        <div className="hero-copy reveal reveal-delay-1">
          <p className="eyebrow">Welcome to Denzhe's</p>
          <h1>Slow down.<br /><em>Glow up.</em></h1>
          <p className="hero-intro">Knotless and Fulani braids, sculpted nails, lashes and wig installs, booked in calm, unhurried sessions at Denzhe's Beauty Bar.</p>
          <p className="hero-note">Upload your inspiration when booking. Denzhe reviews the look and prepares everything before you arrive.</p>
          <div className="hero-actions"><button className="button button--dark" onClick={onBook}>Choose your moment <ArrowIcon /></button><button className="text-link" onClick={onMobile}>Request a house call</button></div>
        </div>
        <div className="hero-index reveal reveal-delay-2"><span>{settings.address}</span><span>{settings.hours}</span></div>
      </div>
    </section>
  );
}

const ritual = [
  ['01', 'Choose your style and upload a photo', 'Pick your service, customise the length, and attach a picture of the exact look you want.'],
  ['02', 'Pick a live calendar slot', 'Choose an open day and time. Once a slot is reserved, it is no longer available to anyone else.'],
  ['03', 'Denzhe reviews your RSVP', 'She checks your style reference, confirms what is needed, and sends the payment details.'],
  ['04', 'Your deposit secures the moment', 'The deposit locks your time and helps Denzhe prepare or buy supplies before you arrive.'],
];

function Ritual({ settings }: { settings: BusinessSettings }) {
  return (
    <section className="ritual section" id="ritual">
      <div className="section-heading"><div><p className="eyebrow">A calm, considered booking ritual</p><h2>How RSVP<br /><em>bookings work</em></h2></div><p>Long sessions deserve focus. Every appointment is reserved with enough time for your look, without rushing or double bookings.</p></div>
      <div className="ritual-list">
        {ritual.map(([number, title, copy], index) => <article className="ritual-row reveal" key={number} style={{ animationDelay: `${index * 90}ms` }}><span className="ritual-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="ritual-step">Step {index + 1} of 4</span></article>)}
      </div>
      <div className="guidance"><div><strong>Not sure what suits you?</strong><span>Chat to Denzhe for honest style guidance.</span></div><a href={`${phoneToWhatsApp(settings.phone)}?text=Hi%20Denzhe,%20I%20need%20help%20choosing%20a%20style.`}>WhatsApp Denzhe <ArrowIcon /></a></div>
    </section>
  );
}

function Services({ onBook, serviceList }: { onBook: (service: Service, variant?: ServiceVariant) => void; serviceList: Service[] }) {
  const [active, setActive] = useState('all');
  const activeServices = serviceList.filter(service => service.active !== false);
  const visible = active === 'all' ? activeServices : activeServices.filter(service => service.category === active);
  return (
    <section className="services section" id="services">
      <div className="section-heading section-heading--services"><div><p className="eyebrow">Services and time allocations</p><h2>Choose your<br /><em>moment</em></h2></div><p>Every session is unhurried. Choose a nail length and the price updates instantly. All braid, tribal and cornrow styles include the hairpiece.</p></div>
      <div className="category-tabs" role="tablist" aria-label="Service categories">{categories.map(category => <button key={category.id} className={active === category.id ? 'active' : ''} onClick={() => setActive(category.id)}>{category.label}</button>)}</div>
      <div className="service-grid">{visible.map((service, index) => <ServiceBubble key={service.id} service={service} onBook={onBook} index={index} />)}</div>
    </section>
  );
}

function MobileSection({ onOpen, settings }: { onOpen: () => void; settings: BusinessSettings }) {
  return (
    <section className="mobile-section" id="mobile">
      <div className="mobile-image"><img src="/images/beauty-mobile-house-call.jpg" alt="Braider providing a Beauty Mobile house-call service" /></div>
      <div className="mobile-copy"><p className="eyebrow">Denzhe's Beauty Mobile</p><h2>House calls,<br /><em>your couch, your glow.</em></h2><p>Tell us where you live, upload the style you want, and let us know whether you have your own hairpiece. Denzhe will calculate travel and arrive prepared.</p><ul><li><span>Call-out fee</span><strong>R{settings.calloutFee}</strong></li><li><span>Travel per kilometre</span><strong>R{settings.ratePerKm}</strong></li><li><span>Example: 10 km visit</span><strong>R{settings.calloutFee + settings.ratePerKm * 10}</strong></li></ul><p className="mobile-note">Your deposit secures the visit and helps cover any hair or products purchased for your style.</p><button className="button button--cream" onClick={onOpen}>Plan my mobile visit <ArrowIcon /></button></div>
    </section>
  );
}

const gallery = [
  ['/images/real-work-curly-pondo.jpg', 'Curly high ponytail by Denzhe Beauty Bar'],
  ['/images/real-work-wig-install.jpg', 'Laid side-part wig installation by Denzhe Beauty Bar'],
  ['/images/real-work-pedicure.jpg', 'Blush French pedicure by Denzhe Beauty Bar'],
  ['/images/real-work-design-nails.jpg', 'Pink floral design nails by Denzhe Beauty Bar'],
];

function Lookbook() {
  return <section className="lookbook section"><div className="section-heading"><div><p className="eyebrow">Work from the beauty bar</p><h2>Real artistry,<br /><em>real results</em></h2></div><p>These are looks created by Denzhe. Choose one you love or bring your own inspiration photo when you reserve.</p></div><div className="lookbook-grid">{gallery.map(([src, alt], index) => <figure key={src} className={`lookbook-${index + 1}`}><img src={src} alt={alt} /></figure>)}</div></section>;
}

function MobileModal({ open, onClose, settings, onRequest }: { open: boolean; onClose: () => void; settings: BusinessSettings; onRequest: (booking: Booking) => void }) {
  const [distance, setDistance] = useState(10);
  const [photoName, setPhotoName] = useState('');
  const [photo, setPhoto] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '', service: '', hairpiece: '', date: '', notes: '' });
  if (!open) return null;
  const total = settings.calloutFee + distance * settings.ratePerKm;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onRequest({ id: createReference('MOB'), type: 'mobile', clientName: form.name, phone: form.phone, serviceId: 'beauty-mobile', serviceName: form.service || 'Beauty Mobile request', price: total, date: form.date, time: '', duration: 'To confirm', notes: form.notes, stylePhoto: photo, stylePhotoName: photoName, address: form.address, hairpiece: form.hairpiece, distanceKm: distance, status: 'pending', createdAt: new Date().toISOString() });
    onClose();
    window.open(`${phoneToWhatsApp(settings.phone)}?text=${encodeURIComponent(`Hi Denzhe, I have sent a Beauty Mobile request for ${form.service}.`)}`, '_blank');
  };
  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Beauty Mobile request"><button className="modal-backdrop" onClick={onClose} aria-label="Close" /><form className="mobile-form" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}>Close</button><p className="eyebrow">Beauty Mobile request</p><h2>Your home.<br /><em>Your moment.</em></h2>
      <label>Name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your full name" /></label>
      <label>WhatsApp number<input required type="tel" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="066 377 3941" /></label>
      <label>Service or style<input required value={form.service} onChange={event => setForm({ ...form, service: event.target.value })} placeholder="e.g. Knotless braids" /></label>
      <label>Preferred date<input required type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label>
      <label>Address<textarea required rows={2} value={form.address} onChange={event => setForm({ ...form, address: event.target.value })} placeholder="Street, suburb and area" /></label>
      <label>Style reference<span className="file-input"><input type="file" accept="image/*" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; setPhotoName(file.name); setPhoto(await compressImage(file)); }} />{photoName || 'Choose a photo from your gallery'}</span></label>
      <label>Hairpiece<select required value={form.hairpiece} onChange={event => setForm({ ...form, hairpiece: event.target.value })}><option value="" disabled>Select an option</option><option>I have my own hairpiece</option><option>Please provide the hairpiece</option><option>I need advice</option></select></label>
      <label>Notes<textarea rows={2} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} placeholder="Anything Denzhe should know" /></label>
      <label>Approximate distance: {distance} km<input type="range" min="1" max="50" value={distance} onChange={event => setDistance(Number(event.target.value))} /></label><div className="travel-total"><span>Estimated call-out and travel</span><strong>R{total}</strong></div><button className="button button--dark" type="submit">Send mobile request <ArrowIcon /></button></form></div>
  );
}

function Footer({ settings, onAdmin }: { settings: BusinessSettings; onAdmin: () => void }) {
  return (
    <footer>
      <div className="footer-brand">Denzhe's <em>Beauty Bar</em></div>
      <div className="footer-grid">
        <div className="footer-block footer-block--main">
          <p className="footer-kicker">Book your calm beauty moment</p>
          <p>Salon appointments, Beauty Mobile house calls, braids, nails, lashes, pondo and wig services.</p>
          <a className="footer-cta" href={phoneToWhatsApp(settings.phone)}>Book on WhatsApp <ArrowIcon /></a>
        </div>
        <div className="footer-block">
          <h4>Contact</h4>
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook page</a>
        </div>
        <div className="footer-block">
          <h4>Visit</h4>
          <span>{settings.address}</span>
          <span>{settings.hours}</span>
        </div>
        <div className="footer-block">
          <h4>Quick Links</h4>
          <a href="#services">Services</a>
          <a href="#ritual">How RSVP works</a>
          <a href="#mobile">Beauty Mobile</a>
          <a href="#top">Back to top</a>
          <button className="footer-admin-link" onClick={onAdmin}>Staff portal</button>
        </div>
      </div>
      <div className="footer-bottom"><span>Calm care, considered beauty.</span><span>Denzhe's Beauty Bar</span></div>
    </footer>
  );
}

export default function App() {
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [bookingVariant, setBookingVariant] = useState<ServiceVariant | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#admin');
  const [serviceList, setServiceList] = useState<Service[]>(loadServices);
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);
  const [settings, setSettings] = useState<BusinessSettings>(loadSettings);
  const openBooking = (service: Service, variant?: ServiceVariant) => { setBookingService(service); setBookingVariant(variant); };
  const updateBookings = (next: Booking[]) => { setBookings(next); saveBookings(next); };
  const updateServices = (next: Service[]) => { setServiceList(next); saveServices(next); };
  const updateSettings = (next: BusinessSettings) => { setSettings(next); saveSettings(next); };
  const addBooking = (booking: Booking) => updateBookings([booking, ...bookings]);
  const openAdmin = () => { window.history.replaceState(null, '', '#admin'); setAdminOpen(true); };
  const closeAdmin = () => { window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`); setAdminOpen(false); };
  return <main><Header onMobile={() => setMobileOpen(true)} onAdmin={openAdmin} /><Hero settings={settings} onBook={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} onMobile={() => setMobileOpen(true)} /><Ritual settings={settings} /><Services serviceList={serviceList} onBook={openBooking} /><MobileSection settings={settings} onOpen={() => setMobileOpen(true)} /><Lookbook /><Footer settings={settings} onAdmin={openAdmin} /><BookingModal isOpen={Boolean(bookingService)} service={bookingService} selectedVariant={bookingVariant} bookings={bookings} onBookingCreated={addBooking} onClose={() => { setBookingService(null); setBookingVariant(undefined); }} /><MobileModal open={mobileOpen} settings={settings} onRequest={addBooking} onClose={() => setMobileOpen(false)} /><AdminPanel open={adminOpen} onClose={closeAdmin} bookings={bookings} onBookingsChange={updateBookings} services={serviceList} onServicesChange={updateServices} settings={settings} onSettingsChange={updateSettings} /></main>;
}