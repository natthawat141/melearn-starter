import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { PARTNERS } from '@/data/partners';

export default function PartnersSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title="พันธมิตรของเรา" className="mb-12" />
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              className="bg-white rounded-xl shadow-md p-4 w-48 h-32 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.04 }}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={70}
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-gray-600 mt-12 max-w-2xl mx-auto font-sans text-sm leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Melearn ร่วมมือกับสถาบันการศึกษาและชุมชนชั้นนำ เพื่อสร้างแพลตฟอร์มการเรียนรู้
          ที่มีคุณภาพและเข้าถึงได้สำหรับทุกคน
        </motion.p>
      </Container>
    </section>
  );
}
