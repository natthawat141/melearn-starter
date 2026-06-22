import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import CourseCard from '@/components/ui/CourseCard';
import { FEATURED_COURSES } from '@/data/courses';

export default function FeaturedCoursesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <Container>
        <SectionHeading
          title="หลักสูตรยอดนิยม"
          subtitle="เลือกเรียนจากหลักสูตรที่ออกแบบร่วมกับผู้เชี่ยวชาญในวงการ"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_COURSES.map(course => (
            <CourseCard key={course.id} course={course} variant="featured" />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-block bg-sky-600 text-white hover:bg-sky-500 px-8 py-3 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            ดูหลักสูตรทั้งหมด
          </Link>
        </div>
      </Container>
    </section>
  );
}
