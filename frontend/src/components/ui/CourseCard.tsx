import Image from 'next/image';
import { FaStar, FaUsers, FaClock } from 'react-icons/fa';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Course } from '@/types';

/** featured: compact layout; catalog: full metadata (rating, price, duration). */
export type CourseCardVariant = 'featured' | 'catalog';

interface CourseCardProps {
  course: Course;
  variant?: CourseCardVariant;
}

const LEVEL_LABEL: Record<Course['level'], string> = {
  beginner: 'ผู้เริ่มต้น',
  intermediate: 'ระดับกลาง',
  advanced: 'ขั้นสูง',
};

const LEVEL_BADGE_VARIANT: Record<Course['level'], 'sky' | 'yellow' | 'gray'> = {
  beginner: 'sky',
  intermediate: 'yellow',
  advanced: 'gray',
};

export default function CourseCard({
  course,
  variant = 'featured',
}: CourseCardProps) {
  const isCatalog = variant === 'catalog';

  return (
    <div
      className={[
        'bg-white rounded-xl overflow-hidden shadow-lg flex flex-col',
        isCatalog ? 'h-full' : 'hover:scale-105 transform transition duration-300',
      ].join(' ')}
    >
      <div className="aspect-video overflow-hidden bg-gray-100 relative">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {isCatalog && (
            <Badge variant={LEVEL_BADGE_VARIANT[course.level]}>
              {LEVEL_LABEL[course.level]}
            </Badge>
          )}
          <Badge variant="sky">{course.category}</Badge>
          {!isCatalog && (
            <Badge variant="gray">{LEVEL_LABEL[course.level]}</Badge>
          )}
        </div>

        {isCatalog ? (
          <h2 className="text-xl font-bold text-gray-800 font-display mt-1 mb-2">
            {course.title}
          </h2>
        ) : (
          <h3 className="text-xl font-semibold text-sky-600 font-display mt-1 mb-2">
            {course.title}
          </h3>
        )}

        <p
          className={[
            'text-gray-600 text-sm leading-relaxed mb-3',
            isCatalog ? 'line-clamp-2' : '',
          ].join(' ')}
        >
          {course.description}
        </p>

        {isCatalog && course.rating !== undefined && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <FaStar className="text-yellow-400" aria-hidden="true" />
            <span className="font-semibold">{course.rating.toFixed(1)}</span>
            {course.studentCount !== undefined && (
              <span className="opacity-60">
                ({course.studentCount.toLocaleString()} ผู้เรียน)
              </span>
            )}
          </div>
        )}

        {isCatalog && (course.duration !== undefined || course.studentCount !== undefined) && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            {course.duration !== undefined && (
              <span className="flex items-center gap-1">
                <FaClock aria-hidden="true" /> {course.duration}
              </span>
            )}
            {course.studentCount !== undefined && (
              <span className="flex items-center gap-1">
                <FaUsers aria-hidden="true" /> {course.studentCount.toLocaleString()}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.map(tag => (
            <Badge key={tag} variant="sky">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {isCatalog && course.price !== null && course.price !== undefined && (
            <span className="text-2xl font-bold text-gray-800">
              ${course.price.toFixed(2)}
            </span>
          )}
          <Button variant="accent" size="sm" className="ml-auto">
            {isCatalog ? 'สมัครเรียน' : 'เรียนรู้เพิ่มเติม'}
          </Button>
        </div>
      </div>
    </div>
  );
}
