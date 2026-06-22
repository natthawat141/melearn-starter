import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

// framer-motion in jsdom: render motion elements as plain elements, drop animation props.
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, tag: string) => {
        return ({ children, ...rest }: { children?: ReactNode }) => {
          // Strip framer-only props so React does not warn.
          const { initial, animate, exit, transition, whileHover, whileInView, viewport, ...domProps } =
            rest as Record<string, unknown>;
          void initial; void animate; void exit; void transition; void whileHover; void whileInView; void viewport;
          const Tag = tag as keyof JSX.IntrinsicElements;
          return <Tag {...domProps}>{children}</Tag>;
        };
      },
    },
  ),
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import NewsletterSection from './NewsletterSection';

describe('NewsletterSection', () => {
  // Submission tests use real timers; the rotation test opts into fake timers
  // locally to avoid the userEvent/fake-timer deadlock.

  it('renders the subscription form with an accessible email field', () => {
    render(<NewsletterSection />);
    const form = screen.getByRole('form', { name: 'Newsletter subscription' });
    expect(form).toBeInTheDocument();
    expect(screen.getByLabelText('อีเมลสำหรับรับข่าวสาร')).toHaveAttribute('type', 'email');
  });

  it('shows a success alert after a valid submission and clears the input', async () => {
    const user = userEvent.setup();
    render(<NewsletterSection />);

    const input = screen.getByLabelText('อีเมลสำหรับรับข่าวสาร');
    await user.type(input, 'student@example.com');
    await user.click(screen.getByRole('button', { name: 'สมัคร' }));

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    // Form is replaced by the alert.
    expect(screen.queryByRole('form', { name: 'Newsletter subscription' })).not.toBeInTheDocument();
  });

  it('requires an email (input has the required attribute)', () => {
    render(<NewsletterSection />);
    expect(screen.getByLabelText('อีเมลสำหรับรับข่าวสาร')).toBeRequired();
  });

  it('rotates the headline on the interval timer', () => {
    vi.useFakeTimers();
    try {
      render(<NewsletterSection />);
      // First headline visible.
      expect(screen.getByText('เรียนรู้ที่ใช้ได้จริง ไม่ใช่แค่ทฤษฎี')).toBeInTheDocument();
      // Advance past the 4500ms rotation interval; wrap the resulting state update in act.
      // (A residual act warning from AnimatePresence's keyed re-render is benign;
      // the assertion below is deterministic.)
      act(() => {
        vi.advanceTimersByTime(4500);
      });
      expect(screen.getByText('Blockchain credential ที่ employer เชื่อถือ')).toBeInTheDocument();
    } finally {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    }
  });
});
