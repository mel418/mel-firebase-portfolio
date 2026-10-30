'use client';

import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'Income' | 'Rent' | 'Groceries' | 'Dining' | 'Transport' | 'Subscriptions' | 'Savings';
type Row = { date: string; merchant: string; amount: number; category: Category };

// A made-up statement: nothing here is anyone's real data.
const STATEMENT: Row[] = [
  { date: 'Oct 01', merchant: 'PAYROLL ACME INC', amount: 3200, category: 'Income' },
  { date: 'Oct 01', merchant: 'OAKVIEW APARTMENTS', amount: -1450, category: 'Rent' },
  { date: 'Oct 02', merchant: 'TRADER JOES #123', amount: -86.4, category: 'Groceries' },
  { date: 'Oct 03', merchant: 'SPOTIFY USA', amount: -11.99, category: 'Subscriptions' },
  { date: 'Oct 04', merchant: 'BLUE BOTTLE COFFEE', amount: -6.5, category: 'Dining' },
  { date: 'Oct 05', merchant: 'SHELL OIL 5731', amount: -48.2, category: 'Transport' },
  { date: 'Oct 07', merchant: 'SWEETGREEN', amount: -17.25, category: 'Dining' },
  { date: 'Oct 09', merchant: 'WHOLEFDS MKT 10', amount: -112.3, category: 'Groceries' },
  { date: 'Oct 11', merchant: 'NETFLIX.COM', amount: -15.49, category: 'Subscriptions' },
  { date: 'Oct 12', merchant: 'UBER TRIP', amount: -23.8, category: 'Transport' },
  { date: 'Oct 15', merchant: 'DOORDASH*PIZZA', amount: -34.9, category: 'Dining' },
  { date: 'Oct 18', merchant: 'TRANSFER TO SAVINGS', amount: -400, category: 'Savings' },
];

const SPEND_CATEGORIES: Category[] = ['Rent', 'Groceries', 'Dining', 'Transport', 'Subscriptions'];
const usd = (n: number) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * A sandbox of PennySprout's core idea: a messy statement goes in, categories,
 * a spending breakdown and a health score come out. The categories are fixed
 * sample data — no AI is called — and the score is an illustrative formula,
 * not the app's real one.
 */
export function FinanceDemo() {
  const [done, setDone] = useState(0); // rows categorised so far
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (done >= STATEMENT.length) {
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setDone((d) => d + 1), 170);
    return () => window.clearTimeout(id);
  }, [running, done]);

  const finished = done >= STATEMENT.length;

  const summary = useMemo(() => {
    const income = STATEMENT.filter((r) => r.category === 'Income').reduce((s, r) => s + r.amount, 0);
    const saved = -STATEMENT.filter((r) => r.category === 'Savings').reduce((s, r) => s + r.amount, 0);
    const byCategory = SPEND_CATEGORIES.map((c) => ({
      category: c,
      total: -STATEMENT.filter((r) => r.category === c).reduce((s, r) => s + r.amount, 0),
    }));
    const spent = byCategory.reduce((s, c) => s + c.total, 0);
    // Illustrative only: reward a healthy savings rate and spending well under income.
    const score = Math.max(1, Math.min(10, 3 + (saved / income) * 20 + (1 - spent / income) * 4));
    return { income, saved, spent, byCategory, score };
  }, []);

  const max = Math.max(...summary.byCategory.map((c) => c.total));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">A sample bank statement. Press analyze to categorize it.</p>
        <button
          type="button"
          onClick={() => {
            if (finished || done > 0) setDone(0);
            setRunning(!(finished || done > 0));
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          {finished || done > 0 ? <RotateCcw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {finished || done > 0 ? 'Reset' : 'Analyze'}
        </button>
      </div>

      <ul className="divide-y divide-border rounded-2xl border border-border text-xs sm:text-sm">
        {STATEMENT.map((r, i) => (
          <li key={i} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 px-3 py-2 sm:grid-cols-[4rem_1fr_6rem_6.5rem]">
            <span className="font-code text-[11px] text-muted-foreground">{r.date}</span>
            <span className="truncate font-code text-[11px] sm:text-xs">{r.merchant}</span>
            <span className={cn('hidden text-right font-code text-xs sm:block', r.amount > 0 && 'text-accent-ink')}>{usd(r.amount)}</span>
            <span className="flex justify-end">
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-300',
                  i < done ? 'bg-primary/15 text-accent-ink opacity-100' : 'bg-muted text-transparent opacity-60'
                )}
              >
                {i < done ? r.category : 'uncategorized'}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className={cn('grid gap-6 transition-all duration-500 sm:grid-cols-[1fr_9rem]', finished ? 'opacity-100' : 'pointer-events-none opacity-25')}>
        <div className="space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Spending breakdown</p>
          {summary.byCategory.map((c) => (
            <div key={c.category} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-xs">
              <span className="text-muted-foreground">{c.category}</span>
              <span className="h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-editorial"
                  style={{ width: `${(c.total / max) * 100}%`, transform: finished ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </span>
              <span className="text-right font-code text-[11px]">${Math.round(c.total)}</span>
            </div>
          ))}
        </div>
        <div className="text-center sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Health score</p>
          <p className="mt-2 font-headline text-5xl font-extrabold leading-none tracking-tight text-accent-ink [font-variant-numeric:tabular-nums]">
            {finished ? summary.score.toFixed(1) : '–'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">out of 10</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Sample data only, with no AI call. The real app has Claude read your PDF or CSV statement, links accounts through Plaid, and caches each month so a statement never hits the AI twice.
      </p>
    </div>
  );
}
