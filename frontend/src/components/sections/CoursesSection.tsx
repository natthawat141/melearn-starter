import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import CourseCard from '@/components/ui/CourseCard';
import { ALL_COURSES } from '@/data/courses';

export default function CoursesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <Container>
        <h1 className="text-4xl font-display font-bold text-center text-gray-800 mb-4">
          หลักสูตรทั้งหมด
        </h1>
        <p className="text-center text-gray-600 mb-16 font-sans">
          เลือกเรียนจากหลักสูตรที่ออกแบบร่วมกับผู้เชี่ยวชาญ
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CourseCard course={course} variant="catalog" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
