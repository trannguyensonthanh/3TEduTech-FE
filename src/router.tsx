import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Courses from './pages/Courses';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Instructors from './pages/Instructors';
import InstructorDetail from './pages/InstructorDetail';
import About from './pages/About';
import CourseDetail from './pages/CourseDetail';
import CourseSectionDetail from './pages/CourseSectionDetail';
import LessonView from './pages/LessonView';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ActivateAccount from './pages/auth/ActivateAccount';
import SocialLoginCallback from './pages/auth/SocialLoginCallback';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import InstructorManagement from './pages/admin/InstructorManagement';
import CourseApprovals from './pages/admin/CourseApprovals';
import PaymentManagement from './pages/admin/PaymentManagement';
import PayoutManagement from './pages/admin/PayoutManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import PromotionsManagement from './pages/admin/PromotionsManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CourseCreation from './pages/instructor/CourseCreation';
import CourseEdit from './pages/instructor/CourseEdit';
import InstructorAnalytics from './pages/instructor/InstructorAnalytics';
import InstructorStudents from './pages/instructor/InstructorStudents';
import InstructorEarnings from './pages/instructor/InstructorEarnings';
import InstructorEarnings_v2 from '@/pages/instructor/InstructorEarnings_v2';
import InstructorRegister from './pages/instructor/InstructorRegister';
import InstructorRegisterSuccess from './pages/instructor/InstructorRegisterSuccess';
import InstructorProfile from './pages/instructor/InstructorProfile';
import InstructorSettings from './pages/instructor/InstructorSettings';
import InstructorCourseApprovals from './pages/instructor/InstructorCourseApprovals';
import InstructorQnA from '@/pages/instructor/InstructorQnA';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import UserProfile from './pages/UserProfile';
import CheckoutReturn from './pages/CheckoutReturn';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCanceled from './pages/PaymentCanceled';
import OrderHistory from '@/pages/OrderHistory';
import Certificates from '@/pages/Certificates';
import NotificationSettings from '@/pages/user/NotificationSettings';
import CourseLearningPage from '@/pages/CourseLearningPage';
import SkillsManagement from '@/pages/admin/SkillsManagement';
import LevelsManagement from './pages/admin/LevelsManagement';
import CurrenciesManagement from './pages/admin/CurrenciesManagement';
import PaymentMethodsManagement from './pages/admin/PaymentMethodsManagement';
import ExchangeRatesManagement from './pages/admin/ExchangeRatesManagement';
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route
          path="/profile/notifications"
          element={<NotificationSettings />}
        />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetail />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/instructors/:id" element={<InstructorDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify-email" element={<ActivateAccount />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/social-success" element={<SocialLoginCallback />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/courses" element={<CoursesManagement />} />
        <Route path="/admin/instructors" element={<InstructorManagement />} />
        <Route path="/admin/course-approvals" element={<CourseApprovals />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/payouts" element={<PayoutManagement />} />
        <Route path="/admin/categories" element={<CategoriesManagement />} />
        <Route path="/admin/promotions" element={<PromotionsManagement />} />
        <Route path="/admin/skills" element={<SkillsManagement />} />
        <Route path="/admin/levels" element={<LevelsManagement />} />
        <Route path="/admin/currencies" element={<CurrenciesManagement />} />
        <Route
          path="/admin/payment-methods"
          element={<PaymentMethodsManagement />}
        />
        <Route
          path="/admin/exchange-rates"
          element={<ExchangeRatesManagement />}
        />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<InstructorCourses />} />
        <Route path="/instructor/courses/create" element={<CourseCreation />} />
        <Route
          path="/instructor/courses/:courseId/edit"
          element={<CourseEdit />}
        />
        <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
        <Route path="/instructor/students" element={<InstructorStudents />} />
        <Route path="/instructor/earnings" element={<InstructorEarnings />} />
        <Route
          path="/instructor/earnings_v2"
          element={<InstructorEarnings_v2 />}
        />
        <Route path="/instructor/register" element={<InstructorRegister />} />
        <Route
          path="/instructor/register/success"
          element={<InstructorRegisterSuccess />}
        />
        <Route
          path="/instructor/course-approvals"
          element={<InstructorCourseApprovals />}
        />
        <Route path="/instructor/profile" element={<InstructorProfile />} />
        <Route path="/instructor/settings" element={<InstructorSettings />} />
        <Route path="/instructor/qna" element={<InstructorQnA />} />
        <Route
          path="/checkout/momo/return"
          element={<CheckoutReturn paymentMethod="momo" />}
        />
        <Route
          path="/checkout/vnpay/return"
          element={<CheckoutReturn paymentMethod="vnpay" />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-canceled" element={<PaymentCanceled />} />
        <Route path="/learn/:courseSlug" element={<CourseLearningPage />} />
        <Route
          path="/courses/:courseId/sections/:sectionId"
          element={<CourseSectionDetail />}
        />
        <Route
          path="/courses/:courseId/sections/:sectionId/lessons/:lessonId"
          element={<LessonView />}
        />
        <Route
          path="/learn/:courseSlug/lessons/:lessonId"
          element={<CourseLearningPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
