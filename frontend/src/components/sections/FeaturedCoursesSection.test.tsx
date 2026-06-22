import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// next/image: render as a plain img so alt-text and src assertions work in jsdom.
vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string; [k: string]: unknown }) => {
    const { fill, sizes, priority, ...domProps } = rest;
    void fill; void sizes; void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...(domProps as Record<string, unknown>)} />;
  },
}));

import FeaturedCoursesSection from './FeaturedCoursesSection';

describe('FeaturedCoursesSection', () => {
  it('renders all featured course cards as headings', () => {
    render(<FeaturedCoursesSection />);
    expect(screen.getByRole('heading', { name: 'Introduction to Blockchain' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Advanced React Development' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Data Science Fundamentals' })).toBeInTheDocument();
  });

  it('renders the Thai level label for each course', () => {
    render(<FeaturedCoursesSection />);
    // Two beginner courses -> two "ผู้เริ่มต้น" badges.
    expect(screen.getAllByText('ผู้เริ่มต้น')).toHaveLength(2);
    expect(screen.getByText('ระดับกลาง')).toBeInTheDocument();
  });

  it('gives every course image an alt text equal to its title', () => {
    render(<FeaturedCoursesSection />);
    expect(screen.getByAltText('Introduction to Blockchain')).toBeInTheDocument();
  });

  it('links to the full course catalog', () => {
    render(<FeaturedCoursesSection />);
    expect(screen.getByRole('link', { name: 'ดูหลักสูตรทั้งหมด' })).toHaveAttribute('href', '/courses');
  });

  it('renders the course thumbnail with the correct src via next/image', () => {
    render(<FeaturedCoursesSection />);
    const img = screen.getByAltText('Introduction to Blockchain') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/img/courses/blockchain.jpg');
  });

  it('renders a CTA button per featured course', () => {
    render(<FeaturedCoursesSection />);
    expect(screen.getAllByRole('button', { name: 'เรียนรู้เพิ่มเติม' })).toHaveLength(3);
  });
});
