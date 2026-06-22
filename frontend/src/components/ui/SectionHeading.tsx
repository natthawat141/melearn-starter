interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Heading level — defaults to h2 */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <Tag className="text-3xl md:text-4xl font-display font-bold text-sky-700">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-3 text-gray-600 font-sans text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
