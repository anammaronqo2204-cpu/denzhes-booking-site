import { services as defaultServices, type Service } from './services';

export type BookingStatus = 'pending' | 'approved' | 'payment-sent' | 'confirmed' | 'completed' | 'declined';

export interface Booking {
  id: string;
  type: 'salon' | 'mobile';
  clientName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  variant?: string;
  price: number;
  date: string;
  time: string;
  duration?: string;
  notes: string;
  stylePhoto?: string;
  stylePhotoName?: string;
  address?: string;
  hairpiece?: string;
  distanceKm?: number;
  depositAmount?: number;
  depositProof?: string;
  depositProofName?: string;
  latePolicyAccepted?: boolean;
  status: BookingStatus;
  createdAt: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  username: string;
  pin: string;
  role: 'owner' | 'staff';
}

export interface BusinessSettings {
  phone: string;
  email: string;
  facebook: string;
  address: string;
  hours: string;
  calloutFee: number;
  ratePerKm: number;
  depositPercent: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  paymentReferenceNote: string;
  payShapNumber: string;
  payShapName: string;
  payShapNote: string;
}

const KEYS = {
  bookings: 'denzhe_bookings_v1',
  services: 'denzhe_services_v1',
  staff: 'denzhe_staff_v1',
  settings: 'denzhe_settings_v1',
};

export const defaultSettings: BusinessSettings = {
  phone: '066 377 3941',
  email: 'witnessnevhutanda@gmail.com',
  facebook: 'https://www.facebook.com/share/1DGEXrGJNG/?mibextid=wwXIfr',
  address: '15 Adis Ababa Street, Ext 2, Cosmo City',
  hours: 'Mon to Sat, 09:00 to 18:00',
  calloutFee: 150,
  ratePerKm: 12,
  depositPercent: 50,
  bankName: 'FNB (First National Bank)',
  accountName: "Denzhe's Beauty Bar",
  accountNumber: '00000000000',
  branchCode: '250655',
  accountType: 'Cheque / Current Account',
  paymentReferenceNote: 'Please use your booking reference as the payment reference.',
  payShapNumber: '0663773941',
  payShapName: 'Denzhe Nevhuthanda',
  payShapNote: 'PayShap is instant and cheaper than standard EFT (which can take 1–3 business days to clear). Works with Tymebank/GoTyme Bank and Capitec.',
};

const defaultStaff: StaffAccount[] = [
  { id: 'owner-denzhe', name: 'Denzhe', username: 'denzhe', pin: '3941', role: 'owner' },
  { id: 'staff-starter', name: 'Beauty Bar Staff', username: 'staff', pin: '3773', role: 'staff' },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const loadBookings = () => load<Booking[]>(KEYS.bookings, []);
export const saveBookings = (bookings: Booking[]) => save(KEYS.bookings, bookings);
export const loadServices = () => load<Service[]>(KEYS.services, defaultServices).map(service => ({ ...service, active: service.active !== false }));
export const saveServices = (serviceList: Service[]) => save(KEYS.services, serviceList);
export const loadStaff = () => load<StaffAccount[]>(KEYS.staff, defaultStaff);
export const saveStaff = (staff: StaffAccount[]) => save(KEYS.staff, staff);
export const loadSettings = () => ({ ...defaultSettings, ...load<BusinessSettings>(KEYS.settings, defaultSettings) });
export const saveSettings = (settings: BusinessSettings) => save(KEYS.settings, settings);

export function createReference(prefix = 'DNZ') {
  return `${prefix}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export function durationToMinutes(duration = '~1 hr') {
  const values = duration.match(/\d+(?:\.\d+)?/g)?.map(Number) || [1];
  const longest = Math.max(...values);
  return /min/i.test(duration) ? longest : longest * 60;
}

export function phoneToWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('0') ? `27${digits.slice(1)}` : digits}`;
}

export function compressImage(file: File, maxSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Could not load image'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', .72));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}