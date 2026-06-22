import Container from '@/components/ui/Container';

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: '5,000+', label: 'ผู้เรียนที่ลงทะเบียน' },
  { value: '20+', label: 'หลักสูตรที่พร้อมเรียน' },
  { value: '5', label: 'พันธมิตรสถาบัน' },
  { value: '100%', label: 'Credential ตรวจสอบได้บน Solana' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-sky-700" aria-label="ตัวเลขที่บอกเล่าเรา">
      <Container>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <dt className="text-3xl md:text-4xl font-display font-bold text-white">
                {value}
              </dt>
              <dd className="mt-1 text-sky-200 text-sm font-sans">{label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
