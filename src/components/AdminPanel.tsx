import { useMemo, useState } from 'react';
import type { Service } from '../data/services';
import { categories } from '../data/services';
import {
  loadStaff,
  phoneToWhatsApp,
  saveStaff,
  type Booking,
  type BookingStatus,
  type BusinessSettings,
  type StaffAccount,
} from '../data/adminStore';
import './admin.css';

interface Props {
  open: boolean;
  onClose: () => void;
  bookings: Booking[];
  onBookingsChange: (bookings: Booking[]) => void;
  services: Service[];
  onServicesChange: (services: Service[]) => void;
  settings: BusinessSettings;
  onSettingsChange: (settings: BusinessSettings) => void;
}

type Tab = 'overview' | 'bookings' | 'services' | 'settings' | 'staff';

const statusLabels: Record<BookingStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  'payment-sent': 'Payment sent',
  confirmed: 'Confirmed',
  completed: 'Completed',
  declined: 'Declined',
};

const emptyService: Service = {
  id: '',
  name: '',
  category: 'nails',
  image: '',
  emoji: '',
  price: 0,
  duration: '~1 hr',
  description: '',
  active: true,
};

function formatDate(date: string) {
  if (!date) return 'Date to confirm';
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Login({ onLogin, onClose }: { onLogin: (account: StaffAccount) => void; onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = loadStaff().find(item => item.username.toLowerCase() === username.trim().toLowerCase() && item.pin === pin);
    if (!account) {
      setError('That username or PIN is not correct.');
      return;
    }
    sessionStorage.setItem('denzhe_admin_session', account.id);
    onLogin(account);
  };

  return (
    <div className="admin-login-shell">
      <button className="admin-public-link" onClick={onClose}>Back to website</button>
      <form className="admin-login" onSubmit={submit}>
        <div className="admin-login-mark">D</div>
        <p className="admin-overline">Private staff portal</p>
        <h2>Welcome back.</h2>
        <p>Sign in to manage Denzhe's Beauty Bar.</p>
        <label>Username<input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>4-digit PIN<input value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" type="password" autoComplete="current-password" required /></label>
        {error && <div className="admin-error">{error}</div>}
        <button className="admin-primary" type="submit">Enter dashboard</button>
        <div className="admin-login-help"><strong>First sign-in</strong><span>Owner: denzhe / 3941</span><span>Staff: staff / 3773</span></div>
      </form>
    </div>
  );
}

export default function AdminPanel({ open, onClose, bookings, onBookingsChange, services, onServicesChange, settings, onSettingsChange }: Props) {
  const [account, setAccount] = useState<StaffAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    const id = sessionStorage.getItem('denzhe_admin_session');
    return loadStaff().find(item => item.id === id) || null;
  });
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [editing, setEditing] = useState<Service | null>(null);
  const [serviceDraft, setServiceDraft] = useState<Service>(emptyService);
  const [variantText, setVariantText] = useState('');
  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [staff, setStaff] = useState(loadStaff());
  const [newStaff, setNewStaff] = useState({ name: '', username: '', pin: '', role: 'staff' as 'staff' | 'owner' });

  const owner = account?.role === 'owner';
  const upcoming = useMemo(() => bookings.filter(item => item.status !== 'declined' && item.status !== 'completed').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)), [bookings]);
  const filteredBookings = useMemo(() => bookings.filter(booking => {
    const text = `${booking.clientName} ${booking.phone} ${booking.serviceName} ${booking.id}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (statusFilter === 'all' || booking.status === statusFilter);
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [bookings, query, statusFilter]);

  if (!open) return null;
  if (!account) return <div className="admin-panel"><Login onLogin={setAccount} onClose={onClose} /></div>;

  const changeBookingStatus = (id: string, status: BookingStatus) => onBookingsChange(bookings.map(item => item.id === id ? { ...item, status } : item));
  const removeBooking = (id: string) => {
    if (window.confirm('Delete this booking permanently?')) onBookingsChange(bookings.filter(item => item.id !== id));
  };
  const startEdit = (service?: Service) => {
    const value = service ? { ...service, variants: service.variants?.map(item => ({ ...item })) } : { ...emptyService };
    setServiceDraft(value);
    setVariantText(value.variants?.map(item => `${item.label}: ${item.price}`).join('\n') || '');
    setEditing(value);
  };
  const saveService = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedVariants = variantText.split('\n').map(line => {
      const [label, price] = line.split(':');
      return { label: label?.trim(), price: Number(price?.trim()) };
    }).filter(item => item.label && Number.isFinite(item.price) && item.price > 0) as { label: string; price: number }[];
    const saved: Service = {
      ...serviceDraft,
      id: serviceDraft.id || `${serviceDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36).slice(-3)}`,
      price: parsedVariants.length ? undefined : Number(serviceDraft.price || 0),
      variants: parsedVariants.length ? parsedVariants : undefined,
      active: serviceDraft.active !== false,
    };
    onServicesChange(services.some(item => item.id === saved.id) ? services.map(item => item.id === saved.id ? saved : item) : [...services, saved]);
    setEditing(null);
  };
  const deleteService = (id: string) => {
    if (window.confirm('Remove this service from the menu?')) onServicesChange(services.filter(item => item.id !== id));
  };
  const addStaff = (event: React.FormEvent) => {
    event.preventDefault();
    if (staff.some(item => item.username.toLowerCase() === newStaff.username.toLowerCase())) return;
    const updated = [...staff, { ...newStaff, id: `staff-${Date.now().toString(36)}` }];
    setStaff(updated);
    saveStaff(updated);
    setNewStaff({ name: '', username: '', pin: '', role: 'staff' });
  };
  const removeStaff = (id: string) => {
    if (id === account.id || id === 'owner-denzhe') return;
    const updated = staff.filter(item => item.id !== id);
    setStaff(updated);
    saveStaff(updated);
  };
  const changeStaffPin = (id: string) => {
    const pin = window.prompt('Enter a new 4-digit PIN');
    if (!pin || !/^\d{4}$/.test(pin)) return;
    const updated = staff.map(item => item.id === id ? { ...item, pin } : item);
    setStaff(updated);
    saveStaff(updated);
    if (account.id === id) setAccount({ ...account, pin });
  };
  const logout = () => {
    sessionStorage.removeItem('denzhe_admin_session');
    setAccount(null);
    setTab('overview');
  };

  const tabs: { id: Tab; label: string; ownerOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'services', label: 'Services & prices', ownerOnly: true },
    { id: 'settings', label: 'Business settings', ownerOnly: true },
    { id: 'staff', label: 'Staff access', ownerOnly: true },
  ];

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand"><span>D</span><div>Denzhe's<small>Business portal</small></div></div>
        <nav>{tabs.filter(item => !item.ownerOnly || owner).map(item => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}</nav>
        <div className="admin-user"><span>{account.name.slice(0, 1)}</span><div><strong>{account.name}</strong><small>{account.role}</small></div></div>
        <button className="admin-logout" onClick={logout}>Sign out</button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar"><div><p>{owner ? 'Owner dashboard' : 'Staff dashboard'}</p><h1>{tab === 'overview' ? `Good day, ${account.name}.` : tabs.find(item => item.id === tab)?.label}</h1></div><div className="admin-top-actions"><button onClick={onClose}>View website</button><button onClick={logout}>Sign out</button></div></header>

        {tab === 'overview' && <section className="admin-page">
          <div className="admin-metrics">
            <article><span>New requests</span><strong>{bookings.filter(item => item.status === 'pending').length}</strong><small>Waiting for review</small></article>
            <article><span>Upcoming bookings</span><strong>{upcoming.length}</strong><small>Active reservations</small></article>
            <article><span>Confirmed value</span><strong>R{bookings.filter(item => item.status === 'confirmed' || item.status === 'completed').reduce((total, item) => total + item.price, 0)}</strong><small>Confirmed and completed</small></article>
            <article><span>Live services</span><strong>{services.filter(item => item.active !== false).length}</strong><small>Visible on the website</small></article>
          </div>
          <div className="admin-section-heading"><div><p>Next in the diary</p><h2>Upcoming appointments</h2></div><button onClick={() => setTab('bookings')}>See all bookings</button></div>
          <div className="admin-upcoming">
            {upcoming.slice(0, 5).map(item => <article key={item.id}><time><strong>{item.date ? new Date(`${item.date}T00:00:00`).getDate() : '--'}</strong><span>{item.date ? new Date(`${item.date}T00:00:00`).toLocaleDateString('en-ZA', { month: 'short' }) : 'TBC'}</span></time><div><h3>{item.clientName}</h3><p>{item.serviceName}{item.variant ? ` · ${item.variant}` : ''}</p></div><span>{item.time || 'Time TBC'}</span><b className={`status status--${item.status}`}>{statusLabels[item.status]}</b></article>)}
            {!upcoming.length && <div className="admin-empty">No upcoming bookings yet. New website requests will appear here.</div>}
          </div>
        </section>}

        {tab === 'bookings' && <section className="admin-page">
          <div className="admin-tools"><input placeholder="Search name, number or service" value={query} onChange={event => setQuery(event.target.value)} /><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'all' | BookingStatus)}><option value="all">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="booking-list">
            {filteredBookings.map(booking => <article className="booking-row" key={booking.id}>
              <div className="booking-client"><span>{booking.clientName.slice(0, 1)}</span><div><h3>{booking.clientName}</h3><a href={`tel:${booking.phone}`}>{booking.phone}</a><small>{booking.id} · {booking.type === 'mobile' ? 'Beauty Mobile' : 'Salon'}</small></div></div>
              <div className="booking-service"><strong>{booking.serviceName}</strong><span>{booking.variant || 'Standard option'} · R{booking.price}</span>{booking.notes && <small>{booking.notes}</small>}</div>
              <div className="booking-date"><strong>{formatDate(booking.date)}</strong><span>{booking.time || 'Time to confirm'}</span>{booking.address && <small>{booking.address}</small>}</div>
              {booking.stylePhoto ? <a className="booking-photo" href={booking.stylePhoto} target="_blank" rel="noreferrer"><img src={booking.stylePhoto} alt="Client style reference" /><span>View photo</span></a> : <div className="booking-photo booking-photo--empty">No photo</div>}
              {booking.depositProof ? <a className="booking-photo booking-deposit" href={booking.depositProof} target="_blank" rel="noreferrer"><img src={booking.depositProof} alt="Deposit proof of payment" /><span>Deposit {booking.depositAmount ? `R${booking.depositAmount}` : ''} · View PoP</span></a> : <div className="booking-photo booking-photo--empty">No deposit proof</div>}
              <div className="booking-actions"><select className={`status-select status--${booking.status}`} value={booking.status} onChange={event => changeBookingStatus(booking.id, event.target.value as BookingStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><a href={`${phoneToWhatsApp(booking.phone)}?text=${encodeURIComponent(`Hi ${booking.clientName}, this is Denzhe's Beauty Bar regarding your ${booking.serviceName} booking.`)}`} target="_blank" rel="noreferrer">WhatsApp</a>{owner && <button onClick={() => removeBooking(booking.id)}>Delete</button>}</div>
            </article>)}
            {!filteredBookings.length && <div className="admin-empty">No bookings match this view.</div>}
          </div>
        </section>}

        {tab === 'services' && owner && <section className="admin-page">
          <div className="admin-section-heading"><div><p>Website menu</p><h2>Edit services and prices</h2></div><button className="admin-primary" onClick={() => startEdit()}>Add service</button></div>
          <div className="service-admin-list">{services.map(service => <article key={service.id}><img src={service.image} alt="" /><div><small>{service.category}</small><h3>{service.name}</h3><p>{service.variants ? service.variants.map(item => `${item.label} R${item.price}`).join(' · ') : `R${service.price}`}</p></div><span className={service.active === false ? 'offline' : 'live'}>{service.active === false ? 'Hidden' : 'Live'}</span><button onClick={() => onServicesChange(services.map(item => item.id === service.id ? { ...item, active: item.active === false } : item))}>{service.active === false ? 'Show' : 'Hide'}</button><button onClick={() => startEdit(service)}>Edit</button><button className="danger" onClick={() => deleteService(service.id)}>Remove</button></article>)}</div>
        </section>}

        {tab === 'settings' && owner && <section className="admin-page admin-settings">
          <div className="admin-section-heading"><div><p>Public information</p><h2>Business settings</h2></div></div>
          <form onSubmit={event => { event.preventDefault(); onSettingsChange(settingsDraft); }}><label>Phone number<input value={settingsDraft.phone} onChange={event => setSettingsDraft({ ...settingsDraft, phone: event.target.value })} /></label><label>Email address<input type="email" value={settingsDraft.email} onChange={event => setSettingsDraft({ ...settingsDraft, email: event.target.value })} /></label><label>Facebook page<input value={settingsDraft.facebook} onChange={event => setSettingsDraft({ ...settingsDraft, facebook: event.target.value })} /></label><label>Salon address<input value={settingsDraft.address} onChange={event => setSettingsDraft({ ...settingsDraft, address: event.target.value })} /></label><label>Opening hours<input value={settingsDraft.hours} onChange={event => setSettingsDraft({ ...settingsDraft, hours: event.target.value })} /></label><div className="settings-split"><label>Mobile call-out fee<input type="number" min="0" value={settingsDraft.calloutFee} onChange={event => setSettingsDraft({ ...settingsDraft, calloutFee: Number(event.target.value) })} /></label><label>Travel rate per km<input type="number" min="0" value={settingsDraft.ratePerKm} onChange={event => setSettingsDraft({ ...settingsDraft, ratePerKm: Number(event.target.value) })} /></label></div>
          <div className="admin-section-heading"><div><p>Deposits</p><h2>Banking details shown at checkout</h2></div></div>
          <label>Deposit percentage required<input type="number" min="0" max="100" value={settingsDraft.depositPercent} onChange={event => setSettingsDraft({ ...settingsDraft, depositPercent: Number(event.target.value) })} /></label>
          <label>PayShap number<input value={settingsDraft.payShapNumber} onChange={event => setSettingsDraft({ ...settingsDraft, payShapNumber: event.target.value })} /></label>
          <label>PayShap name<input value={settingsDraft.payShapName} onChange={event => setSettingsDraft({ ...settingsDraft, payShapName: event.target.value })} /></label>
          <label>PayShap note<input value={settingsDraft.payShapNote} onChange={event => setSettingsDraft({ ...settingsDraft, payShapNote: event.target.value })} /></label>
          <label>Bank name (EFT fallback)<input value={settingsDraft.bankName} onChange={event => setSettingsDraft({ ...settingsDraft, bankName: event.target.value })} /></label>
          <label>Account name<input value={settingsDraft.accountName} onChange={event => setSettingsDraft({ ...settingsDraft, accountName: event.target.value })} /></label>
          <div className="settings-split"><label>Account number<input value={settingsDraft.accountNumber} onChange={event => setSettingsDraft({ ...settingsDraft, accountNumber: event.target.value })} /></label><label>Branch code<input value={settingsDraft.branchCode} onChange={event => setSettingsDraft({ ...settingsDraft, branchCode: event.target.value })} /></label></div>
          <label>Account type<input value={settingsDraft.accountType} onChange={event => setSettingsDraft({ ...settingsDraft, accountType: event.target.value })} /></label>
          <label>Payment reference note<input value={settingsDraft.paymentReferenceNote} onChange={event => setSettingsDraft({ ...settingsDraft, paymentReferenceNote: event.target.value })} /></label>
          <button className="admin-primary" type="submit">Save business settings</button></form>
        </section>}

        {tab === 'staff' && owner && <section className="admin-page">
          <div className="admin-section-heading"><div><p>Private access</p><h2>Staff accounts</h2></div></div>
          <div className="staff-layout"><div className="staff-list">{staff.map(item => <article key={item.id}><span>{item.name.slice(0, 1)}</span><div><h3>{item.name}</h3><p>@{item.username} · {item.role}</p></div><button onClick={() => changeStaffPin(item.id)}>Change PIN</button>{item.id !== account.id && item.id !== 'owner-denzhe' && <button onClick={() => removeStaff(item.id)}>Remove</button>}</article>)}</div><form className="staff-form" onSubmit={addStaff}><h3>Add a team member</h3><label>Name<input required value={newStaff.name} onChange={event => setNewStaff({ ...newStaff, name: event.target.value })} /></label><label>Username<input required value={newStaff.username} onChange={event => setNewStaff({ ...newStaff, username: event.target.value.replace(/\s/g, '').toLowerCase() })} /></label><label>4-digit PIN<input required value={newStaff.pin} onChange={event => setNewStaff({ ...newStaff, pin: event.target.value.replace(/\D/g, '').slice(0, 4) })} inputMode="numeric" minLength={4} /></label><label>Role<select value={newStaff.role} onChange={event => setNewStaff({ ...newStaff, role: event.target.value as 'owner' | 'staff' })}><option value="staff">Staff</option><option value="owner">Owner / manager</option></select></label><button className="admin-primary" type="submit">Create account</button></form></div>
        </section>}
      </div>

      {editing && <div className="service-editor-shell"><button className="service-editor-backdrop" onClick={() => setEditing(null)} /><form className="service-editor" onSubmit={saveService}><button className="editor-close" type="button" onClick={() => setEditing(null)}>Close</button><p className="admin-overline">Menu editor</p><h2>{serviceDraft.id ? 'Edit service' : 'Add service'}</h2><label>Service name<input required value={serviceDraft.name} onChange={event => setServiceDraft({ ...serviceDraft, name: event.target.value })} /></label><div className="editor-split"><label>Category<select value={serviceDraft.category} onChange={event => setServiceDraft({ ...serviceDraft, category: event.target.value as Service['category'] })}>{categories.filter(item => item.id !== 'all').map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Duration<input required value={serviceDraft.duration} onChange={event => setServiceDraft({ ...serviceDraft, duration: event.target.value })} /></label></div><label>Single price<input type="number" min="0" value={serviceDraft.price || ''} onChange={event => setServiceDraft({ ...serviceDraft, price: Number(event.target.value) })} /><small>Leave blank when using length prices below.</small></label><label>Length prices<textarea rows={4} value={variantText} onChange={event => setVariantText(event.target.value)} placeholder={'Short: 180\nMedium: 200\nLong: 220'} /><small>One option per line in the format Name: Price.</small></label><label>Image URL<input required value={serviceDraft.image} onChange={event => setServiceDraft({ ...serviceDraft, image: event.target.value })} /></label><label>Description<textarea required rows={3} value={serviceDraft.description} onChange={event => setServiceDraft({ ...serviceDraft, description: event.target.value })} /></label><label className="editor-check"><input type="checkbox" checked={serviceDraft.active !== false} onChange={event => setServiceDraft({ ...serviceDraft, active: event.target.checked })} />Show this service on the public website</label><button className="admin-primary" type="submit">Save service</button></form></div>}
    </div>
  );
}