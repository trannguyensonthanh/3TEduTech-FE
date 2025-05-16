import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FaHome } from 'react-icons/fa'; // Ví dụ sử dụng react-icons

// Một SVG đơn giản cho trang 404
const NotFoundIllustration = () => (
  <svg
    className="w-64 h-64 mx-auto text-indigo-500 dark:text-indigo-400 mb-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M14.828 14.828L16.243 16.243M17.657 17.657L19.071 19.071M6.343 6.343L4.929 4.929M7.757 7.757L6.343 6.343"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 6V4m0 16v-2m4-12l1.414-1.414M6 18l-1.414 1.414m12-10.586L19.071 4.93M4.929 19.071L6 18"
    ></path>
  </svg>
);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
    document.title = '404 - Page Not Found'; // Cập nhật tiêu đề trang
    // Bạn có thể gửi thông tin này lên một dịch vụ logging như Sentry, LogRocket
    // sendErrorToTrackingService({ type: '404', path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-800 dark:to-sky-900 p-4 transition-colors duration-500">
      <div className="bg-white dark:bg-slate-700 p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-all hover:scale-105 duration-300">
        <NotFoundIllustration />

        <h1 className="text-7xl sm:text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 tracking-tighter">
          404
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Ôi không! Trang bạn tìm không tồn tại.
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm sm:text-base">
          Có vẻ như bạn đã đi lạc hoặc liên kết đã bị hỏng. Đừng lo, chúng tôi
          giúp bạn quay lại.
        </p>

        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <FaHome className="mr-2 h-5 w-5" />
          Quay về Trang Chủ
        </a>

        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
          Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ bộ phận hỗ trợ.
          <br />
          Đã cố truy cập:{' '}
          <code className="bg-gray-200 dark:bg-slate-600 px-1 py-0.5 rounded text-xs">
            {location.pathname}
          </code>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
