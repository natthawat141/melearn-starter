import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY_FORM: ContactFormState = { name: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    // Roadmap: POST to /api/contact once the endpoint ships
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
    setForm(EMPTY_FORM);
  };

  const inputBase =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-colors duration-150';

  return (
    <>
      <Head>
        <title>ติดต่อเรา | Melearn</title>
        <meta
          name="description"
          content="ติดต่อทีม Melearn สำหรับคำถามเกี่ยวกับหลักสูตร ความร่วมมือ หรือการสนับสนุนด้านเทคนิค"
        />
      </Head>
      <Navbar />
      <main>
        <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
          <Container>
            <SectionHeading
              as="h1"
              title="ติดต่อเรา"
              subtitle="มีคำถามเกี่ยวกับหลักสูตร ความร่วมมือ หรือต้องการความช่วยเหลือ? ส่งข้อความมาได้เลย"
              className="mb-14"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Contact details */}
              <div>
                <h2 className="text-xl font-display font-bold text-sky-700 mb-6">
                  ข้อมูลการติดต่อ
                </h2>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-sm font-semibold text-gray-700 mb-1">อีเมล</dt>
                    <dd>
                      <a
                        href="mailto:support@melearn.co.th"
                        className="text-sky-600 hover:text-sky-800 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                      >
                        support@melearn.co.th
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700 mb-1">
                      เวลาตอบกลับ
                    </dt>
                    <dd className="text-sm text-gray-600">
                      ภายใน 1–2 วันทำการ (จันทร์–ศุกร์)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-gray-700 mb-2">
                      หัวข้อที่เราช่วยได้
                    </dt>
                    <dd>
                      <ul className="space-y-1.5 text-sm text-gray-600 list-none">
                        {[
                          'คำถามเกี่ยวกับเนื้อหาหลักสูตร',
                          'ความร่วมมือกับสถาบันการศึกษา',
                          'การใช้งาน Solana wallet และ credential',
                          'ปัญหาทางเทคนิคและการเข้าถึงบัญชี',
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Contact form */}
              <div>
                <h2 className="text-xl font-display font-bold text-sky-700 mb-6">
                  ส่งข้อความ
                </h2>

                {submitted ? (
                  <div
                    role="alert"
                    className="bg-green-50 text-green-700 border border-green-200 rounded-xl px-6 py-5 text-sm leading-relaxed"
                  >
                    <p className="font-semibold mb-1">ส่งข้อความสำเร็จ!</p>
                    <p>
                      ขอบคุณที่ติดต่อเรา ทีมงานจะตอบกลับภายใน 1–2 วันทำการ
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-green-700 underline underline-offset-2 text-sm hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
                    >
                      ส่งข้อความอีกครั้ง
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    aria-label="แบบฟอร์มติดต่อ"
                    noValidate
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        ชื่อ–นามสกุล{' '}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        placeholder="เช่น สมชาย ใจดี"
                        className={inputBase}
                        aria-required="true"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        อีเมล{' '}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        className={inputBase}
                        aria-required="true"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        ข้อความ{' '}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="บอกเราว่าเราช่วยคุณได้อย่างไร..."
                        className={`${inputBase} resize-none`}
                        aria-required="true"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={submitting}
                      className="w-full justify-center"
                    >
                      {submitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
