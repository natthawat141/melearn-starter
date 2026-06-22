import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from './payload.config'
import type { Course } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Run with: npm run seed
async function seed() {
  const payload = await getPayload({ config: await config })

  payload.logger.info('Seeding Melearn data...')

  payload.logger.info('Clearing old database records...')
  try {
    await payload.delete({ collection: 'courses', where: { id: { exists: true } } })
    await payload.delete({ collection: 'media', where: { id: { exists: true } } })
    await payload.delete({ collection: 'categories', where: { id: { exists: true } } })
    await payload.delete({ collection: 'instructors', where: { id: { exists: true } } })
    await payload.delete({ collection: 'partners', where: { id: { exists: true } } })
  } catch (error) {
    payload.logger.warn('Could not clear database records, continuing with insertion: ' + error)
  }

  const uploadImage = async (fileName: string, altText: string) => {
    const filePath = path.join(dirname, '../seed_images', fileName)
    if (!fs.existsSync(filePath)) {
      payload.logger.error(`Seed image file not found: ${filePath}`)
      return null
    }

    const fileBuffer = fs.readFileSync(filePath)
    const stats = fs.statSync(filePath)

    try {
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: altText,
        },
        file: {
          data: fileBuffer,
          name: fileName,
          mimetype: 'image/jpeg',
          size: stats.size,
        },
      })
      payload.logger.info(`Uploaded media image: ${fileName}`)
      return media.id
    } catch (err) {
      payload.logger.error(`Failed to upload media ${fileName}: ${err}`)
      return null
    }
  }

  const webDevThumbId = await uploadImage('web_dev.jpg', 'Web Development Cover')
  const blockchainThumbId = await uploadImage('blockchain.jpg', 'Blockchain Cover')
  const designThumbId = await uploadImage('design.jpg', 'UI/UX Design Cover')
  const aiMlThumbId = await uploadImage('ai_ml.jpg', 'AI/ML Cover')
  const dataScienceThumbId = await uploadImage('data_science.jpg', 'Data Science Cover')

  const catWeb = await payload.create({
    collection: 'categories',
    data: { name: 'Web Development', slug: 'web-development' },
  })
  const catBlockchain = await payload.create({
    collection: 'categories',
    data: { name: 'Blockchain', slug: 'blockchain' },
  })
  const catDesign = await payload.create({
    collection: 'categories',
    data: { name: 'Design', slug: 'design' },
  })
  const catDataScience = await payload.create({
    collection: 'categories',
    data: { name: 'Data Science', slug: 'data-science' },
  })
  const catAI = await payload.create({
    collection: 'categories',
    data: { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  })

  const instAda = await payload.create({
    collection: 'instructors',
    data: { name: 'Ada Lovelace', bio: 'Pioneer of computing and lifelong educator.' },
  })
  const instSatoshi = await payload.create({
    collection: 'instructors',
    data: { name: 'Satoshi N.', bio: 'Decentralization advocate and blockchain instructor.' },
  })
  const instTuring = await payload.create({
    collection: 'instructors',
    data: { name: 'Alan Turing', bio: 'Father of theoretical computer science and AI.' },
  })
  const instGrace = await payload.create({
    collection: 'instructors',
    data: { name: 'Grace Hopper', bio: 'Computer scientist and pioneer of programming languages.' },
  })

  type CourseInput = Omit<Course, 'id' | 'updatedAt' | 'createdAt' | 'thumbnail' | 'category' | 'instructor'> & {
    thumbnail?: number | undefined
    category?: number | undefined
    instructor?: number | undefined
  }
  const coursesToSeed: CourseInput[] = [
    {
      title: 'Next.js 15 Masterclass',
      slug: 'nextjs-15-masterclass',
      description: 'เรียนรู้การสร้างเว็บแอปพลิเคชันสมัยใหม่ด้วย Next.js 15 App Router ตั้งแต่เริ่มต้นจนถึงระดับโปรดักชัน',
      category: catWeb.id,
      instructor: instAda.id,
      level: 'intermediate',
      price: 89,
      durationWeeks: 8,
      tags: [{ tag: 'nextjs' }, { tag: 'react' }, { tag: 'frontend' }],
      published: true,
      thumbnail: webDevThumbId || undefined,
    },
    {
      title: 'React Native for Beginners',
      slug: 'react-native-for-beginners',
      description: 'เรียนรู้การพัฒนาโมบายล์แอปพลิเคชันแบบ Cross-platform ทั้ง iOS และ Android ด้วย React Native',
      category: catWeb.id,
      instructor: instGrace.id,
      level: 'beginner',
      price: 59,
      durationWeeks: 6,
      tags: [{ tag: 'react-native' }, { tag: 'mobile' }, { tag: 'frontend' }],
      published: true,
      thumbnail: webDevThumbId || undefined,
    },
    {
      title: 'Advanced Node.js & Microservices',
      slug: 'advanced-nodejs-microservices',
      description: 'เจาะลึกการออกแบบ Backend Architecture และระบบ Microservices ด้วย Node.js, Express และ Docker',
      category: catWeb.id,
      instructor: instTuring.id,
      level: 'advanced',
      price: 129,
      durationWeeks: 10,
      tags: [{ tag: 'nodejs' }, { tag: 'backend' }, { tag: 'microservices' }],
      published: true,
      thumbnail: webDevThumbId || undefined,
    },
    {
      title: 'Solidity & Smart Contracts 101',
      slug: 'solidity-smart-contracts-101',
      description: 'เขียน ทดสอบ และ Deploy Smart Contracts บน Ethereum Blockchain ด้วยภาษา Solidity',
      category: catBlockchain.id,
      instructor: instSatoshi.id,
      level: 'beginner',
      price: 79,
      durationWeeks: 6,
      tags: [{ tag: 'solidity' }, { tag: 'ethereum' }, { tag: 'web3' }],
      published: true,
      thumbnail: blockchainThumbId || undefined,
    },
    {
      title: 'Decentralized Finance (DeFi) Engineering',
      slug: 'decentralized-finance-defi-engineering',
      description: 'เจาะลึกการทำงานของ Liquidity Pools, AMMs, Lending Protocols และพัฒนาโปรเจกต์ DeFi ด้วย Smart Contracts',
      category: catBlockchain.id,
      instructor: instSatoshi.id,
      level: 'advanced',
      price: 199,
      durationWeeks: 10,
      tags: [{ tag: 'defi' }, { tag: 'ethereum' }, { tag: 'web3' }],
      published: true,
      thumbnail: blockchainThumbId || undefined,
    },
    {
      title: 'Solana Development Bootcamp',
      slug: 'solana-development-bootcamp',
      description: 'เริ่มต้นเขียนโปรแกรมบน Solana Blockchain ด้วย Rust และ Web3.js สำหรับสร้าง DApps',
      category: catBlockchain.id,
      instructor: instSatoshi.id,
      level: 'intermediate',
      price: 99,
      durationWeeks: 8,
      tags: [{ tag: 'solana' }, { tag: 'rust' }, { tag: 'web3' }],
      published: true,
      thumbnail: blockchainThumbId || undefined,
    },
    {
      title: 'UI/UX Design Fundamentals',
      slug: 'ui-ux-design-fundamentals',
      description: 'เรียนรู้หลักการพื้นฐานในการออกแบบ User Interface และ User Experience ที่ตอบโจทย์ผู้ใช้งานจริง',
      category: catDesign.id,
      instructor: instGrace.id,
      level: 'beginner',
      price: 49,
      durationWeeks: 4,
      tags: [{ tag: 'uiux' }, { tag: 'design' }, { tag: 'figma' }],
      published: true,
      thumbnail: designThumbId || undefined,
    },
    {
      title: 'Advanced Figma Component Design',
      slug: 'advanced-figma-component-design',
      description: 'สร้าง Design Systems แบบ Dynamic ด้วย Variants, Auto Layout และ Interactive Components ใน Figma',
      category: catDesign.id,
      instructor: instAda.id,
      level: 'advanced',
      price: 119,
      durationWeeks: 6,
      tags: [{ tag: 'figma' }, { tag: 'design-systems' }, { tag: 'design' }],
      published: true,
      thumbnail: designThumbId || undefined,
    },
    {
      title: 'Python for Data Analysis',
      slug: 'python-for-data-analysis',
      description: 'ใช้ Python ในการจัดการข้อมูลและวิเคราะห์ทางสถิติด้วย Pandas, NumPy และ Matplotlib',
      category: catDataScience.id,
      instructor: instAda.id,
      level: 'beginner',
      price: 49,
      durationWeeks: 5,
      tags: [{ tag: 'python' }, { tag: 'pandas' }, { tag: 'data-science' }],
      published: true,
      thumbnail: dataScienceThumbId || undefined,
    },
    {
      title: 'Big Data Engineering with Spark',
      slug: 'big-data-engineering-with-spark',
      description: 'จัดการข้อมูลขนาดใหญ่ (Big Data) ด้วย Apache Spark, PySpark และการสร้าง Data Pipelines',
      category: catDataScience.id,
      instructor: instTuring.id,
      level: 'advanced',
      price: 179,
      durationWeeks: 8,
      tags: [{ tag: 'spark' }, { tag: 'big-data' }, { tag: 'data-engineering' }],
      published: true,
      thumbnail: dataScienceThumbId || undefined,
    },
    {
      title: 'Introduction to Machine Learning',
      slug: 'introduction-to-machine-learning',
      description: 'เรียนรู้แนวคิดพื้นฐานของ Machine Learning การประเมินโมเดล และอัลกอริทึมยอดนิยม',
      category: catAI.id,
      instructor: instTuring.id,
      level: 'beginner',
      price: 79,
      durationWeeks: 6,
      tags: [{ tag: 'machine-learning' }, { tag: 'python' }, { tag: 'ai' }],
      published: true,
      thumbnail: aiMlThumbId || undefined,
    },
    {
      title: 'Deep Learning with PyTorch',
      slug: 'deep-learning-with-pytorch',
      description: 'สร้าง Neural Networks และ Convolutional Networks (CNN) สำหรับ Image/Text Classification ด้วย PyTorch',
      category: catAI.id,
      instructor: instTuring.id,
      level: 'advanced',
      price: 199,
      durationWeeks: 12,
      tags: [{ tag: 'deep-learning' }, { tag: 'pytorch' }, { tag: 'neural-networks' }],
      published: true,
      thumbnail: aiMlThumbId || undefined,
    },
    {
      title: 'Generative AI & LLM Deployment',
      slug: 'generative-ai-llm-deployment',
      description: 'นำ Large Language Models (LLMs) ไปใช้งานจริงด้วย LangChain, OpenAI API และเทคนิค RAG',
      category: catAI.id,
      instructor: instAda.id,
      level: 'intermediate',
      price: 149,
      durationWeeks: 8,
      tags: [{ tag: 'generative-ai' }, { tag: 'llm' }, { tag: 'rag' }],
      published: true,
      thumbnail: aiMlThumbId || undefined,
    },
  ]

  for (const courseData of coursesToSeed) {
    try {
      await payload.create({
        collection: 'courses',
        data: courseData,
      })
      payload.logger.info(`Created course: ${courseData.title}`)
    } catch (err) {
      payload.logger.error(`Failed to create course ${courseData.title}: ${err}`)
    }
  }

  const partnersToSeed = [
    { name: 'Google Cloud Partner', url: 'https://cloud.google.com' },
    { name: 'Solana Foundation', url: 'https://solana.com' },
    { name: 'Supabase Partner', url: 'https://supabase.com' },
    { name: 'Payload CMS', url: 'https://payloadcms.com' },
  ]

  for (const partnerData of partnersToSeed) {
    try {
      await payload.create({
        collection: 'partners',
        data: partnerData,
      })
      payload.logger.info(`Created partner: ${partnerData.name}`)
    } catch (err) {
      payload.logger.error(`Failed to create partner ${partnerData.name}: ${err}`)
    }
  }

  payload.logger.info('Seeding complete successfully.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
