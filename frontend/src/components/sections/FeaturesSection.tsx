import { motion } from 'framer-motion';
import { FaGraduationCap, FaLaptopCode, FaRocket } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: FaGraduationCap,
    title: 'ผู้สอนมีประสบการณ์จริง',
    description: 'เรียนจากผู้เชี่ยวชาญในอุตสาหกรรมที่ผ่านงานจริงในสาขานั้น',
  },
  {
    icon: FaLaptopCode,
    title: 'เรียนรู้ผ่านการลงมือทำ',
    description: 'Project-based learning ที่ให้ผู้เรียนสร้างผลงานจริงระหว่างเรียน',
  },
  {
    icon: FaRocket,
    title: 'Credential บน Blockchain',
    description: 'ใบรับรองที่ตรวจสอบได้บน blockchain พร้อมแบ่งปันกับ employer',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-display font-bold text-center text-sky-800 mb-16"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ทำไมต้อง Melearn
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="bg-sky-100 rounded-full p-4 mb-4">
                <feature.icon className="text-4xl text-sky-600" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-sky-800 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          className="bg-sky-700 text-white rounded-xl p-10 flex flex-col items-center text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-white opacity-80 mb-8 font-sans">
            ร่วมกับผู้เรียนที่กำลังพัฒนาทักษะและสร้าง credential บน Melearn
          </p>
          <button className="bg-white text-sky-700 hover:bg-sky-100 px-8 py-3 rounded-full font-medium transition-colors duration-150">
            ดูหลักสูตรทั้งหมด
          </button>
        </motion.div>
      </div>
    </section>
  );
}
