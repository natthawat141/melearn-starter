import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const QUICK_LINKS = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'หลักสูตร', href: '/courses' },
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'ติดต่อเรา', href: '/contact' },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook, label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: FaTwitter, label: 'Twitter / X', href: 'https://twitter.com/' },
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/' },
];

export default function Footer() {
  return (
    <footer className="bg-white text-black shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold font-display mb-3">Melearn</h3>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
            แพลตฟอร์มเรียนรู้ Blockchain, Web3 และทักษะอาชีพ
            สำหรับนักศึกษาและมืออาชีพรุ่นใหม่
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-700 hover:text-sky-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-3">ติดต่อ</h3>
          <a
            href="mailto:support@melearn.co.th"
            className="text-sm text-gray-700 hover:text-sky-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            support@melearn.co.th
          </a>
          <div className="flex gap-4 mt-3">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-sky-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300">
        <p className="text-center text-gray-600 text-sm py-4">
          © {new Date().getFullYear()} Melearn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
