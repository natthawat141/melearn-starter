import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

// next/image: render as a plain img so tests work in jsdom.
vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string; [k: string]: unknown }) => {
    const { fill, sizes, priority, ...domProps } = rest;
    void fill; void sizes; void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...(domProps as Record<string, unknown>)} />;
  },
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, tag: string) => {
        return ({ children, ...rest }: { children?: ReactNode }) => {
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

import CoursesSection from './CoursesSection';

describe('CoursesSection', () => {
  it('renders the page-level h1 heading', () => {
    render(<CoursesSection />);
    expect(screen.getByRole('heading', { level: 1, name: 'หลักสูตรทั้งหมด' })).toBeInTheDocument();
  });

  it('renders each course title as a level-2 heading', () => {
    render(<CoursesSection />);
    expect(screen.getByRole('heading', { level: 2, name: 'Advanced Blockchain Development' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'AI and Machine Learning Masterclass' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Full-Stack Web Development with Next.js' })).toBeInTheDocument();
  });

  it('formats price as a 2-decimal USD value', () => {
    render(<CoursesSection />);
    expect(screen.getByText('$199.99')).toBeInTheDocument();
    expect(screen.getByText('$249.99')).toBeInTheDocument();
  });

  it('renders rating to one decimal place', () => {
    render(<CoursesSection />);
    // Two courses share a 4.9 rating, so match all occurrences.
    expect(screen.getAllByText('4.9')).toHaveLength(2);
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('renders the localized student count', () => {
    render(<CoursesSection />);
    // 15420 -> "15,420" appears in both the rating line and the stats row.
    expect(screen.getAllByText(/15,420/).length).toBeGreaterThan(0);
  });

  it('renders each tag for a course', () => {
    render(<CoursesSection />);
    expect(screen.getByText('Solidity')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('renders an enroll button per course', () => {
    render(<CoursesSection />);
    expect(screen.getAllByRole('button', { name: 'สมัครเรียน' })).toHaveLength(3);
  });
});
