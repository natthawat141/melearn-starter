import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'เลือกหลักสูตร',
    description:
      'เลือกหลักสูตรที่ตรงกับเป้าหมายของคุณ — ตั้งแต่ Blockchain พื้นฐานถึง Web3 ระดับ production พร้อมคำอธิบายชัดเจนว่าจะได้ทักษะอะไรบ้าง',
  },
  {
    number: '02',
    title: 'เรียนและทำ project จริง',
    description:
      'ทุกหลักสูตรเน้น project-based learning — คุณสร้างผลงานจริงระหว่างเรียน ไม่ใช่แค่ดูวิดีโอแล้วจบ',
  },
  {
    number: '03',
    title: 'รับ credential บน Solana',
    description:
      'เมื่อสำเร็จหลักสูตร ระบบออก on-chain credential บน Solana blockchain ที่ employer และสถาบันสามารถตรวจสอบได้ทันที',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading
          title="เรียนอย่างไรบน Melearn"
          subtitle="สามขั้นตอนจากเริ่มต้นถึงมี credential ที่นายจ้างเชื่อถือ"
          className="mb-16"
        />

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-0 relative" aria-label="ขั้นตอนการเรียน">
          {/* Connecting line — desktop only, sits at the vertical centre of the number circles */}
          <li className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-sky-200 pointer-events-none" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <li key={step.number} className="relative flex flex-col items-center text-center px-6 pb-10 md:pb-0">
              <div
                className="w-16 h-16 rounded-full bg-sky-50 border-2 border-sky-200 flex items-center justify-center mb-6 relative z-10"
                aria-hidden="true"
              >
                <span className="text-2xl font-display font-bold text-sky-600">
                  {step.number}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="md:hidden absolute top-16 left-1/2 w-px h-10 bg-sky-200" aria-hidden="true" />
              )}

              <h3 className="text-lg font-display font-bold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
