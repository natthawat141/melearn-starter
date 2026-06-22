import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function CTASection() {
  return (
    <section className="py-20 bg-sky-800" aria-labelledby="cta-heading">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
          >
            พร้อมสร้าง credential แรกของคุณแล้วหรือยัง?
          </h2>
          <p className="text-sky-200 text-base font-sans mb-10 leading-relaxed">
            เข้าร่วมกับนักศึกษาและมืออาชีพกว่า 5,000 คนที่กำลังสร้างทักษะจริงและ
            on-chain credential ที่ใช้ได้ในโลกการทำงาน
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-sky-800 hover:bg-sky-100 px-8 py-3 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              ดูหลักสูตรทั้งหมด
            </Link>
            <Link
              href="/about"
              className="border border-sky-400 text-white hover:bg-sky-700 px-8 py-3 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              เรียนรู้เพิ่มเติม
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
