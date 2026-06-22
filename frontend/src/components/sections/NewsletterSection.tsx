import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_HEADLINES = [
  'เรียนรู้ที่ใช้ได้จริง ไม่ใช่แค่ทฤษฎี',
  'Blockchain credential ที่ employer เชื่อถือ',
  'ก้าวสู่อาชีพ Web3 ด้วยหลักสูตรที่ออกแบบมาเพื่อคุณ',
  'เรียนได้ทุกที่ สะสม credential ตลอดชีวิต',
];

export default function NewsletterSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setCurrentIndex(i => (i + 1) % ROTATING_HEADLINES.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST /api/newsletter with { email } once backend is live
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-sky-100 to-blue-200">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-display font-bold text-sky-800 mb-4">
          ติดตามความเคลื่อนไหว
        </h2>

        <div className="h-12 mb-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="text-xl italic text-sky-800 font-sans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {ROTATING_HEADLINES[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {submitted ? (
          <div role="alert" className="max-w-md mx-auto bg-green-50 text-green-700 border border-green-200 rounded-full px-6 py-3 text-sm font-medium">
            ขอบคุณ! เราจะส่งข้อมูลหลักสูตรใหม่ให้คุณทางอีเมล
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md mx-auto gap-2"
            aria-label="Newsletter subscription"
          >
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 rounded-full bg-white px-5 py-2.5 text-sm border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              required
              aria-label="อีเมลสำหรับรับข่าวสาร"
            />
            <button
              type="submit"
              className="bg-sky-600 text-white hover:bg-sky-500 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              สมัคร
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
