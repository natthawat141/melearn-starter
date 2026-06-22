export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  level: CourseLevel;
  /** USD price — null when not yet published */
  price: number | null;
  rating?: number;
  studentCount?: number;
  duration?: string;
  tags: string[];
}

export interface Partner {
  name: string;
  logo: string;
  url?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
