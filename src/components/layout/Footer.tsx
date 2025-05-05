import { Link } from 'react-router-dom';
import { Icons } from '../common/Icons';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8 text-brand-500 dark:text-brand-400" />
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                3TEduTech
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Empowering learning through technology and AI-assisted education.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              >
                <Icons.facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              >
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              >
                <Icons.instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              >
                <Icons.youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              Courses
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/courses/programming"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Programming
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/data-science"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Data Science
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/business"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/design"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/language"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Language Learning
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-base text-gray-600 hover:text-brand-500 dark:text-gray-300 dark:hover:text-brand-400"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} 3TEduTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
