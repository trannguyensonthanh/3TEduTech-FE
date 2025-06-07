// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';
import { Icons } from '../common/Icons'; // Cần: logo, facebook, twitter, instagram, youtube, linkedin (nếu có)
import { Input } from '@/components/ui/input'; // Cho newsletter (tùy chọn)
import { Button } from '@/components/ui/button'; // Cho newsletter (tùy chọn)
import { Separator } from '@/components/ui/separator'; // Để tạo đường kẻ
import { cn } from '@/lib/utils';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'All Courses', href: '/courses' },
      { label: 'Categories', href: '/categories' },
      { label: 'Instructors', href: '/instructors' },
      { label: 'Free Courses', href: '/courses?isFree=true' }, // Ví dụ link filter
      { label: 'New Releases', href: '/courses?sortBy=createdAt:desc' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' }, // Giả sử có trang blog
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      // { label: 'Affiliates', href: '/affiliates' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Community Forum', href: '/forum' }, // Ví dụ
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      // { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', href: '#', icon: <Icons.facebook className="h-5 w-5" /> },
  { name: 'Twitter', href: '#', icon: <Icons.twitter className="h-5 w-5" /> },
  {
    name: 'Instagram',
    href: '#',
    icon: <Icons.instagram className="h-5 w-5" />,
  },
  { name: 'YouTube', href: '#', icon: <Icons.youtube className="h-5 w-5" /> },
  { name: 'LinkedIn', href: '#', icon: <Icons.linkedin className="h-5 w-5" /> }, // Thêm LinkedIn
];

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border/60 dark:border-slate-800 text-slate-700 dark:text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top Section: Logo, Description, Social Links, Newsletter (Optional) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-12 items-start">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
              <Icons.logo className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="text-2xl font-bold text-foreground dark:text-slate-100 group-hover:text-primary transition-colors">
                3TEduTech
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Empowering learners and educators worldwide through innovative
              technology and accessible, high-quality AI-enhanced education.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Columns - Bắt đầu từ lg:col-span-2 */}
          {footerSections.slice(0, 2).map(
            (
              section // Hai cột đầu
            ) => (
              <div key={section.title} className="lg:col-span-2">
                <h3 className="text-base font-semibold text-foreground dark:text-slate-200 tracking-wider uppercase mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm hover:text-primary dark:hover:text-primary/90 transition-colors hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* Hai cột sau có thể gộp lại hoặc một cột cho newsletter */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {footerSections.slice(2).map(
              (
                section // Hai cột còn lại
              ) => (
                <div key={section.title} className="sm:col-span-1">
                  <h3 className="text-base font-semibold text-foreground dark:text-slate-200 tracking-wider uppercase mb-5">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="text-sm hover:text-primary dark:hover:text-primary/90 transition-colors hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
            {/* Optional: Newsletter Signup */}
            {/* <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-base font-semibold text-foreground dark:text-slate-200 tracking-wider uppercase mb-5">
                Stay Updated
              </h3>
              <p className="text-sm mb-3">Get the latest news, course releases, and special offers directly to your inbox.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-background dark:bg-slate-800 border-border dark:border-slate-700 h-10 flex-grow" />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                  Subscribe
                </Button>
              </form>
            </div> */}
          </div>
        </div>

        <Separator className="dark:bg-slate-700/70" />

        {/* Bottom Section: Copyright and Utility Links */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-muted-foreground mb-4 sm:mb-0">
            © {new Date().getFullYear()} 3TEduTech, Inc. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {/* Các link tiện ích nhỏ ở đây nếu cần, ví dụ: */}
            {/* <Link to="/sitemap" className="hover:text-primary dark:hover:text-primary/90 transition-colors">Sitemap</Link> */}
            {/* <Link to="/accessibility" className="hover:text-primary dark:hover:text-primary/90 transition-colors">Accessibility</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
