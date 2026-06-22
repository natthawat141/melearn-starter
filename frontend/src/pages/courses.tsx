import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CoursesSection from '@/components/sections/CoursesSection';

export default function CoursesPage() {
  return (
    <>
      <Head>
        <title>หลักสูตรทั้งหมด | Melearn</title>
        <meta name="description" content="เลือกเรียนจากหลักสูตร Blockchain, Web3, Data Science และ Web Development ที่ออกแบบร่วมกับผู้เชี่ยวชาญ" />
      </Head>
      <Navbar />
      <main>
        <CoursesSection />
      </main>
      <Footer />
    </>
  );
}
