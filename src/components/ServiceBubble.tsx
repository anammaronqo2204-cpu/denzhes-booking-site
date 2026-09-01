import { useEffect, useRef, useState } from 'react';
import type { Service, ServiceVariant } from '../data/services';

interface Props { service: Service; onBook: (service: Service, variant?: ServiceVariant) => void; index: number; }

export default function ServiceBubble({ service, onBook, index }: Props) {
  const [variant, setVariant] = useState<ServiceVariant | undefined>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const category = service.category === 'pondo' ? 'Pondo / Ponytail' : service.category;
  return (
    <article className="service-item reveal" style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}>
      <figure><img src={service.image} alt={service.name} /><span>{service.duration}</span></figure>
      <div className="service-body"><p className="service-category">{category}</p><div className="service-title"><h3>{service.name}</h3>{service.price && <strong>R{service.price}</strong>}</div><p className="service-description">{service.description}</p>
        {service.variants && <div className="variant-select" ref={ref}><button onClick={() => setOpen(!open)} aria-expanded={open}><span><small>Choose length</small>{variant?.label || 'Select a length'}</span><strong>{variant ? `R${variant.price}` : 'View prices'}</strong><svg viewBox="0 0 20 20"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>{open && <div className="variant-menu">{service.variants.map(option => <button key={option.label} onClick={() => { setVariant(option); setOpen(false); }} className={variant?.label === option.label ? 'selected' : ''}><span>{option.label}</span><strong>R{option.price}</strong></button>)}</div>}</div>}
        <button className="service-book" onClick={() => service.variants && !variant ? setOpen(true) : onBook(service, variant)}>{service.variants && !variant ? 'Choose a length' : 'Reserve this service'}<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg></button>
      </div>
    </article>
  );
}