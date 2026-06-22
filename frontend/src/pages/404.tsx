import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 — ไม่พบหน้านี้ | Melearn</title>
        <meta name="description" content="ไม่พบหน้าที่คุณกำลังมองหา" />
      </Head>
      <Navbar />
      <main>
        <section className="py-32 bg-gradient-to-b from-sky-50 to-white min-h-[60vh] flex items-center">
          <Container>
            <div className="max-w-lg mx-auto text-center">
              <p
                className="text-9xl font-display font-bold text-sky-100 select-none"
                aria-hidden="true"
              >
                404
              </p>
              <h1 className="text-2xl font-display font-bold text-sky-700 mt-2 mb-4">
                ไม่พบหน้านี้
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-10">
                หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือ URL อาจพิมพ์ผิด
              </p>
              <Link
                href="/"
                className="inline-block bg-sky-600 text-white hover:bg-sky-500 px-8 py-3 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 motion-reduce:transition-none"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
