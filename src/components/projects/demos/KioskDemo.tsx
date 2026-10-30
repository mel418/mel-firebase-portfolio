'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const DRINKS = ['Matcha latte', 'Iced matcha', 'Hojicha latte', 'Strawberry matcha'];
const MILKS = ['Oat', 'Whole', 'Almond'];
const SWEETNESS = ['Less sweet', 'Regular', 'Extra sweet'];

type Status = 'offline' | 'received' | 'whisking' | 'ready';
type Order = { id: number; label: string; status: Status; since: number };

const STATUS_COPY: Record<Status, string> = {
  offline: 'Saved on this device',
  received: 'Received',
  whisking: 'Whisking',
  ready: 'Ready · text sent',
};

function Choice({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            o === value ? 'border-primary bg-primary/15 text-accent-ink' : 'border-border text-muted-foreground hover:border-primary/50'
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/**
 * A sandbox of the Matcha Order Kiosk: place an order on the "guest" side and
 * watch it move through the "barista" queue. Flip the venue Wi-Fi off and
 * orders are held on the device, then sync when it comes back — the same
 * offline-first idea the real kiosk uses (IndexedDB), sample data only.
 */
export function KioskDemo() {
  const [online, setOnline] = useState(true);
  const [drink, setDrink] = useState(DRINKS[0]);
  const [milk, setMilk] = useState(MILKS[0]);
  const [sweet, setSweet] = useState(SWEETNESS[1]);
  const [orders, setOrders] = useState<Order[]>([]);
  const nextId = useRef(101);
  const onlineRef = useRef(online);
  onlineRef.current = online;

  // Moves each order along: synced → received → whisking → ready.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o): Order => {
          if (o.status === 'offline' && onlineRef.current) {
            changed = true;
            return { ...o, status: 'received', since: now };
          }
          if (o.status === 'received' && now - o.since > 1400) {
            changed = true;
            return { ...o, status: 'whisking', since: now };
          }
          if (o.status === 'whisking' && now - o.since > 2600) {
            changed = true;
            return { ...o, status: 'ready', since: now };
          }
          return o;
        });
        return changed ? next : prev;
      });
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  function place() {
    const order: Order = {
      id: nextId.current++,
      label: `${drink}, ${milk.toLowerCase()} milk, ${sweet.toLowerCase()}`,
      status: online ? 'received' : 'offline',
      since: Date.now(),
    };
    setOrders((prev) => [order, ...prev].slice(0, 5));
  }

  const waiting = orders.filter((o) => o.status === 'offline').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Order a drink, then drop the venue Wi-Fi and order again.</p>
        <button
          type="button"
          role="switch"
          aria-checked={online}
          onClick={() => setOnline((v) => !v)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            online ? 'border-primary/40 text-accent-ink' : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
          )}
        >
          {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          Venue Wi-Fi: {online ? 'online' : 'offline'}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Guest kiosk</p>
          <Choice label="Drink" options={DRINKS} value={drink} onChange={setDrink} />
          <Choice label="Milk" options={MILKS} value={milk} onChange={setMilk} />
          <Choice label="Sweetness" options={SWEETNESS} value={sweet} onChange={setSweet} />
          <button
            type="button"
            onClick={place}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Place order
          </button>
          {!online && <p className="text-xs text-muted-foreground">No Wi-Fi: the order is kept on this device and syncs when it is back.</p>}
        </div>

        <div className="space-y-3 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Barista queue</p>
            {waiting > 0 && <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{waiting} waiting to sync</span>}
          </div>
          {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul aria-live="polite" className="space-y-2">
              {orders.map((o) => (
                <li key={o.id} className="space-y-1.5 rounded-xl bg-muted/40 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-code text-[11px] text-muted-foreground">#{o.id}</p>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                      o.status === 'offline' && 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                      o.status === 'received' && 'bg-primary/10 text-accent-ink',
                      o.status === 'whisking' && 'bg-primary/20 text-accent-ink',
                      o.status === 'ready' && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {o.status === 'ready' && <Check className="h-3 w-3" />}
                    {STATUS_COPY[o.status]}
                  </span>
                  </div>
                  <p className="text-sm font-medium leading-snug">{o.label}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        A simulation with sample data. The real kiosk runs on Supabase Realtime, keeps orders in IndexedDB while offline, and texts guests through Twilio when their order is ready.
      </p>
    </div>
  );
}
