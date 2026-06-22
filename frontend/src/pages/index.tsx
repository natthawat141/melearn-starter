import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import FeaturedCoursesSection from '@/components/sections/FeaturedCoursesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PartnersSection from '@/components/sections/PartnersSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Melearn — เรียนรู้ทักษะแห่งอนาคต | Blockchain, Web3 และทักษะอาชีพ</title>
        <meta
          name="description"
          content="แพลตฟอร์มเรียนรู้ Blockchain, Web3 และทักษะอาชีพ พร้อม on-chain credential สำหรับนักศึกษาและมืออาชีพรุ่นใหม่"
        />
      </Head>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedCoursesSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PartnersSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
