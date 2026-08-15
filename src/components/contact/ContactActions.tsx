'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MagneticWrap } from '@/components/primitives/MagneticWrap';

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast({ description: 'Email copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ description: 'Could not copy — the address is above.', variant: 'destructive' });
    }
  }

  return (
    <MagneticWrap strength={0.25}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="rounded-full hover:border-primary hover:text-primary transition-colors"
      >
        {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
        {copied ? 'Copied' : 'Copy email'}
      </Button>
    </MagneticWrap>
  );
}
