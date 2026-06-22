import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { PARTNERS } from '@/data/partners';

interface ValueItem {
  title: string;
  body: string;
}

const VALUES: ValueItem[] = [
  {
    title: 'Grounded — ยึดโยงกับความเป็นจริง',
    body: 'เนื้อหาทุกหลักสูตรมาจากประสบการณ์จริงในอุตสาหกรรม ไม่ใช่ทฤษฎีที่ล้าสมัย เราอัปเดตหลักสูตรอย่างต่อเนื่องให้ตรงกับสิ่งที่นายจ้างและตลาดต้องการจริงๆ',
  },
  {
    title: 'Clear — ชัดเจน ไม่ซับซ้อนเกินจำเป็น',
    body: 'การเรียนรู้ที่ดีคือการที่ผู้เรียนเข้าใจ ไม่ใช่แค่รู้สึกว่าเนื้อหายาก เราออกแบบ learning path ให้มีโครงสร้างที่ชัดเจน วัดผลได้ และรู้ว่าแต่ละขั้นตอนนำไปสู่อะไร',
  },
  {
    title: 'Forward-looking — มองไปข้างหน้า',
    body: 'Blockchain และ Web3 ไม่ใช่เทรนด์ชั่วคราว แต่เป็นโครงสร้างพื้นฐานของเศรษฐกิจดิจิทัล เราสอนทักษะที่จะยังมีคุณค่าในอีก 5–10 ปีข้างหน้า',
  },
];

const CREDENTIAL_BENEFITS = [
  {
    title: 'ตรวจสอบได้ทุกที่ทุกเวลา',
    detail:
      'ไม่ต้องติดต่อสถาบัน ไม่ต้องรอ — anyone สามารถ verify credential ของคุณได้ผ่าน Solana blockchain explorer',
  },
  {
    title: 'เป็นเจ้าของโดย wallet ของคุณ',
    detail:
      'credential ถูก mint เข้า wallet ของคุณโดยตรง ไม่ใช่ PDF ที่เก็บในเซิร์ฟเวอร์ใครสักคน',
  },
  {
    title: 'สะสมทักษะตลอดชีวิต',
    detail:
      'แต่ละหลักสูตรที่สำเร็จเพิ่ม credential ใหม่ใน wallet สร้างประวัติทักษะที่ portable และ permanent',
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>เกี่ยวกับเรา | Melearn</title>
        <meta
          name="description"
          content="Melearn คือแพลตฟอร์มเรียนรู้ Blockchain, Web3 และทักษะอาชีพ พร้อม on-chain credential บน Solana สำหรับนักศึกษาและมืออาชีพรุ่นใหม่"
        />
      </Head>
      <Navbar />
      <main>
        {/* Page header */}
        <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
          <Container>
            <SectionHeading
              as="h1"
              title="เกี่ยวกับ Melearn"
              subtitle="เราเชื่อว่าการศึกษาคุณภาพสูงต้องเข้าถึงได้ และผลลัพธ์ของการเรียนต้องพิสูจน์ได้ด้วยข้อมูลที่ตรวจสอบได้"
              className="max-w-3xl mx-auto"
            />
          </Container>
        </section>

        {/* Mission + story */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-2xl font-display font-bold text-sky-700 mb-4">
                  พันธกิจ
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Melearn เกิดขึ้นจากคำถามเดียวกันที่นักศึกษาและบัณฑิตรุ่นใหม่ถามซ้ำๆ —
                  &quot;เรียนจบแล้วจะพิสูจน์ทักษะอย่างไร?&quot;
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  ใบปริญญาบอกได้ว่าคุณผ่านหลักสูตร แต่ไม่ได้บอกว่าคุณทำอะไรได้จริง
                  ใน Web3 และ Blockchain ecosystem ปัญหานี้ยิ่งชัดเจน เพราะทักษะเปลี่ยนเร็ว
                  และ employer ต้องการหลักฐานที่ตรวจสอบได้ ไม่ใช่แค่ชื่อสถาบัน
                </p>
                <p className="text-gray-700 leading-relaxed">
                  นั่นคือเหตุผลที่เรานำ on-chain credential มาเป็นส่วนหนึ่งของ learning journey
                  credential ทุกใบออกบน Solana blockchain — ตรวจสอบได้ทันที ปลอมแปลงไม่ได้
                  และแบ่งปันกับ employer หรือ LinkedIn ได้โดยตรง
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-bold text-sky-700 mb-4">
                  ทำไมต้อง On-Chain Credential?
                </h2>
                <ul className="space-y-4" role="list">
                  {CREDENTIAL_BENEFITS.map(({ title, detail }) => (
                    <li key={title} className="flex gap-4">
                      <div
                        className="mt-0.5 w-5 h-5 rounded-full bg-sky-100 flex-shrink-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="w-2 h-2 rounded-full bg-sky-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{title}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Values */}
        <section className="py-16 bg-sky-50">
          <Container>
            <SectionHeading
              title="หลักการทำงานของเรา"
              subtitle="สามคำที่กำหนดทุกการตัดสินใจใน Melearn"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VALUES.map(({ title, body }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-sky-500"
                >
                  <h3 className="font-display font-bold text-sky-700 text-base mb-3">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Partners recap */}
        <section className="py-16 bg-white">
          <Container>
            <SectionHeading
              title="พันธมิตรสถาบัน"
              subtitle="เราร่วมมือกับมหาวิทยาลัยและองค์กรชั้นนำเพื่อให้มั่นใจว่าหลักสูตรตรงกับความต้องการจริงของตลาดแรงงาน"
              className="mb-12"
            />
            <div className="flex flex-wrap justify-center items-center gap-6">
              {PARTNERS.map(partner => (
                <div
                  key={partner.name}
                  className="bg-white rounded-xl shadow-md p-4 w-44 h-28 flex items-center justify-center"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={110}
                    height={60}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
