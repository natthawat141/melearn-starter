import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MISSION_ITEMS = [
  {
    title: 'คุณภาพการศึกษา',
    description: 'หลักสูตรมาตรฐานที่ออกแบบร่วมกับผู้เชี่ยวชาญในอุตสาหกรรม',
    iconPath:
      'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    title: 'เข้าถึงได้ทุกที่',
    description: 'เรียนได้ทุกอุปกรณ์ ไม่มีข้อจำกัดด้านสถานที่หรือเวลา',
    iconPath:
      'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
  },
  {
    title: 'Credential บน Blockchain',
    description: 'ใบรับรองที่ตรวจสอบได้บน blockchain พร้อมแบ่งปันกับ employer',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

// prefers-reduced-motion as an external store — avoids setState-in-effect.
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getReducedMotionServerSnapshot = () => false;

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    AOS.init({ duration: 900, once: true, disable: 'phone' });

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <section
        className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/ban.jpg')",
          backgroundAttachment: 'fixed',
          // Parallax disabled when prefers-reduced-motion is set.
          transform: prefersReducedMotion ? undefined : `translateY(${scrollY * 0.15}px)`,
        }}
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <h1
            className="text-5xl md:text-6xl font-display font-bold text-white"
            data-aos="fade-up"
          >
            เรียนรู้ทักษะแห่งอนาคต
          </h1>
          <p
            className="text-xl text-white mt-6 leading-relaxed font-sans"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            หลักสูตร Blockchain, Web3 และทักษะอาชีพ
            พร้อม on-chain credential ผ่าน wallet
          </p>
          <div
            className="mt-8 flex flex-wrap gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link
              href="/courses"
              className="bg-white text-sky-600 hover:bg-sky-200 px-8 py-3 rounded-lg shadow-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              ดูหลักสูตรทั้งหมด
            </Link>
            <Link
              href="/about"
              className="border border-white text-white hover:bg-white hover:text-sky-700 px-8 py-3 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              เกี่ยวกับเรา
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-3xl font-display font-bold text-center text-sky-700 mb-16"
            data-aos="fade-up"
          >
            พันธกิจของเรา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MISSION_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="bg-sky-100 rounded-full p-4 mb-4">
                  <svg
                    className="w-10 h-10 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-sky-700 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
