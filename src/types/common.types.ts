// types/common.types.ts (Có thể tạo file riêng cho các type dùng chung)
export type IsoDateTimeString = string; // Dùng cho DATETIME2
export type IsoDateString = string; // Dùng cho DATE

// --- Authentication & User Roles ---

export interface Role {
  roleId: string; // 'NU', 'GV', 'AD', 'SA'
  roleName: string;
  description?: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export type AccountStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BANNED'
  | 'PENDING_VERIFICATION';

export interface Account {
  accountId: number; // BIGINT maps to number in TS usually
  email: string;
  hashedPassword?: string | null; // Thường không gửi về FE
  roleId: string;
  status: AccountStatus;
  emailVerificationToken?: string | null; // Thường không gửi về FE
  emailVerificationExpires?: IsoDateTimeString | null;
  passwordResetToken?: string | null; // Thường không gửi về FE
  passwordResetExpires?: IsoDateTimeString | null;
  hasSocialLogin: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng từ các bảng khác ---
  userProfile?: UserProfile;
  instructorProfile?: InstructorProfile;
  role?: Role; // Có thể join thêm role nếu cần
}

export type InstructorCourseStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type LoginType = 'EMAIL' | 'GOOGLE' | 'FACEBOOK';

export interface AuthMethod {
  authMethodId: number;
  accountId: number;
  loginType: LoginType;
  externalId?: string | null;
}

// --- User & Instructor Profiles ---

export interface UserProfile {
  accountId: number; // PK và FK
  fullName: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  gender?: 'MALE' | 'FEMALE' | null;
  birthDate?: IsoDateString | null;
  phoneNumber?: string | null;
  headline?: string | null;
  location?: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // Có thể thêm account details nếu cần join
  // account?: Pick<Account, 'email' | 'status'>;
}

export interface Skill {
  skillId: number;
  skillName: string;
  description?: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface InstructorSkill {
  instructorSkillId: number;
  accountId: number;
  skillId: number;
  // Có thể join thêm skill details
  skill?: Skill;
}

export interface InstructorSocialLink {
  socialLinkId: number;
  accountId: number;
  platform: string; // 'LINKEDIN', 'FACEBOOK', 'GITHUB', etc.
  url: string;
}

export interface InstructorProfile {
  accountId: number; // PK và FK
  professionalTitle?: string | null;
  bio?: string | null;
  aboutMe?: string | null; // HTML content
  lastBalanceUpdate?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  skills?: Skill[]; // Từ bảng nối InstructorSkills
  socialLinks?: InstructorSocialLink[];
}

// --- Cart ---

export interface Cart {
  cartId: number;
  accountId: number;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  items?: CartItem[]; // Thường sẽ fetch kèm theo items
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  courseId: number;
  priceAtAddition: number; // DECIMAL maps to number
  addedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  course?: Pick<
    Course,
    | 'courseId'
    | 'courseName'
    | 'slug'
    | 'thumbnailUrl'
    | 'originalPrice'
    | 'discountedPrice'
  >; // Lấy thông tin cơ bản của khóa học
}

// --- Course Structure & Content ---

export interface Category {
  categoryId: number;
  categoryName: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export interface Level {
  levelId: number;
  levelName: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

// Enum cho Course Status ID để dễ sử dụng hơn string
export enum CourseStatusId {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED', // Bổ sung nếu có
}

export interface CourseStatus {
  statusId: CourseStatusId | string; // Cho phép string để linh hoạt, nhưng nên dùng Enum
  statusName: string;
  description?: string | null;
}

export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ';
export type VideoSourceType = 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO';

export interface Subtitle {
  subtitleId?: number; // Có thể không cần id nếu FE chỉ quản lý qua tempId
  tempId?: string | number; // FE temp ID
  lessonId: number; // Hoặc string nếu LessonID là string
  languageCode: string;
  languageName: string;
  subtitleUrl: string;
  isDefault: boolean;
  uploadedAt?: IsoDateTimeString; // Có thể không cần ở FE nếu chỉ thêm/xóa
}

export interface QuizOption {
  optionId?: number;
  tempId?: string | number; // FE temp ID
  questionId: number;
  optionText: string;
  isCorrectAnswer: boolean;
  optionOrder: number;
}

export interface QuizQuestion {
  questionId?: number;
  tempId?: string | number; // FE temp ID
  lessonId: number; // Hoặc string
  questionText: string;
  explanation?: string | null;
  questionOrder: number;
  options: QuizOption[]; // Lồng options vào đây
  createdAt?: IsoDateTimeString;
  updatedAt?: IsoDateTimeString;
}

export interface Attachment {
  attachmentId?: number;
  tempId?: string | number; // FE temp ID
  lessonId: number; // Hoặc string
  fileName: string;
  fileUrl: string; // URL công khai để tải/hiển thị
  fileType?: string | null;
  fileSize?: number | null; // bytes
  cloudStorageId?: string | null; // Để backend xóa nếu cần
  uploadedAt?: IsoDateTimeString;
  // --- Thuộc tính chỉ dùng ở FE khi upload ---
  file?: File | null; // File object thực tế khi upload
}

export interface Lesson {
  lessonId: number; // Hoặc string nếu API trả về string
  tempId?: string | number; // FE temp ID khi tạo mới
  sectionId: number; // Hoặc string
  lessonName: string;
  description?: string | null;
  lessonOrder: number;
  lessonType: LessonType;
  videoSourceType?: VideoSourceType | null;
  externalVideoId?: string | null; // ID từ YT/Vimeo HOẶC Public ID từ Cloudinary
  thumbnailUrl?: string | null;
  videoDurationSeconds?: number | null;
  textContent?: string | null; // Cho lesson type TEXT
  isFreePreview: boolean;
  originalId?: number | null; // Cho việc sao chép khóa học
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu lồng nhau (quan trọng cho FE state) ---
  subtitles?: Subtitle[];
  questions?: QuizQuestion[];
  attachments?: Attachment[];
  // --- Thuộc tính chỉ dùng ở FE khi tạo/sửa ---
  lessonVideoFile?: File | null; // File object khi upload lên Cloudinary
  // externalVideoInput?: string | null; // Có thể dùng làm trường nhập liệu cho YT/Vimeo URL/ID
}

export interface Section {
  sectionId: number; // Hoặc string
  tempId?: string | number; // FE temp ID
  courseId: number; // Hoặc string
  sectionName: string;
  sectionOrder: number;
  description?: string | null;
  originalId?: number | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu lồng nhau ---
  lessons: Lesson[];
}

export interface Course {
  courseId: number; // Hoặc string
  courseName: string;
  slug: string;
  shortDescription: string;
  fullDescription: string; // HTML content
  requirements?: string | null; // HTML content
  learningOutcomes?: string | null; // HTML content
  thumbnailUrl?: string | null;
  introVideoUrl?: string | null;
  originalPrice: number; // DECIMAL maps to number
  discountedPrice?: number | null;
  instructorId: number;
  categoryId: number;
  levelId: number;
  language: string;
  statusId: CourseStatusId | string;
  publishedAt?: IsoDateTimeString | null;
  isFeatured: boolean;
  liveCourseId?: number | null; // ID của khóa học gốc nếu đây là bản nháp
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  thumbnailPublicId?: string | null; // Cloudinary public ID
  introVideoPublicId?: string | null; // Cloudinary public ID
  averageRating?: number | null; // DECIMAL(3,2) -> number
  reviewCount?: number | null;
  // --- Dữ liệu join tiềm năng ---
  category?: Category;
  level?: Level;
  instructor?: Pick<UserProfile, 'accountId' | 'fullName' | 'avatarUrl'> & {
    instructorProfile?: Pick<InstructorProfile, 'professionalTitle'>;
  }; // Thông tin cơ bản của giảng viên

  sections?: Section[]; // Thường được fetch riêng hoặc khi vào trang chi tiết khóa học
  status?: CourseStatus; // Thông tin trạng thái
}

// --- Enrollments & Progress ---

export interface Enrollment {
  enrollmentId: number;
  accountId: number;
  courseId: number;
  enrolledAt: IsoDateTimeString;
  purchasePrice: number;
  // --- Dữ liệu join tiềm năng ---
  course?: Pick<Course, 'courseId' | 'courseName' | 'slug' | 'thumbnailUrl'>;
  account?: Pick<Account, 'accountId' | 'email'>; // Hoặc UserProfile
}

export interface LessonProgress {
  progressId: number;
  accountId: number;
  lessonId: number; // Hoặc string
  isCompleted: boolean;
  completedAt?: IsoDateTimeString | null;
  lastWatchedPosition?: number | null; // Giây
  lastWatchedAt?: IsoDateTimeString | null;
  // --- Dữ liệu join tiềm năng ---
  // lesson?: Pick<Lesson, 'lessonId' | 'lessonName' | 'lessonType'>
}

// --- Reviews ---

export interface CourseReview {
  reviewId: number;
  courseId: number;
  accountId: number;
  rating: number; // 1-5
  comment?: string | null;
  reviewedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  reviewer?: Pick<UserProfile, 'accountId' | 'fullName' | 'avatarUrl'>;
}

// --- Payments, Orders, Promotions ---

export interface Currency {
  currencyId: string; // 'VND', 'USD'
  currencyName: string;
  type: 'FIAT' | 'CRYPTO';
  decimalPlaces: number;
}

export interface PaymentMethod {
  methodId: string; // 'MOMO', 'VNPAY', etc.
  methodName: string;
}

export interface PaymentStatus {
  statusId: string; // 'PENDING', 'SUCCESS', 'FAILED', etc.
  statusName: string;
}

export interface Promotion {
  promotionId: number;
  discountCode: string;
  promotionName: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscountAmount?: number | null;
  startDate: IsoDateTimeString;
  endDate: IsoDateTimeString;
  maxUsageLimit?: number | null;
  usageCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  courseId: number;
  priceAtOrder: number;
  enrollmentId?: number | null;
  // --- Dữ liệu join tiềm năng ---
  course?: Pick<Course, 'courseId' | 'courseName' | 'slug' | 'thumbnailUrl'>;
}

export interface Order {
  orderId: number;
  accountId: number;
  orderDate: IsoDateTimeString;
  originalTotalPrice: number;
  discountAmount: number;
  finalAmount: number;
  promotionId?: number | null;
  paymentId?: number | null;
  orderStatus: OrderStatus;
  // --- Dữ liệu join tiềm năng ---
  items?: OrderItem[];
  promotion?: Pick<Promotion, 'promotionId' | 'discountCode' | 'promotionName'>;
  payment?: Pick<
    CoursePayment,
    'paymentId' | 'paymentStatusId' | 'paymentMethodId'
  >; // Chỉ lấy thông tin cơ bản
}

export interface ExchangeRate {
  rateId: number;
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number; // DECIMAL(36, 18) -> có thể cần dùng string hoặc thư viện Decimal.js nếu cần độ chính xác cực cao ở FE
  effectiveTimestamp: IsoDateTimeString;
  source?: string | null;
}

export interface CoursePayment {
  paymentId: number;
  orderId: number;
  finalAmount: number; // Số tiền cuối cùng của Order (thường bằng convertedTotalAmount)
  paymentMethodId: string;
  originalCurrencyId: string; // Tiền tệ gốc của người dùng khi thanh toán
  originalAmount: number; // Số tiền gốc theo tiền tệ người dùng
  externalTransactionId?: string | null; // ID từ cổng thanh toán
  convertedCurrencyId: string; // Tiền tệ mà hệ thống quy đổi về (VD: VND)
  conversionRate?: number | null;
  convertedTotalAmount: number; // Số tiền sau quy đổi
  transactionFee: number;
  paymentStatusId: string; // 'PENDING', 'SUCCESS', etc.
  transactionCompletedAt?: IsoDateTimeString | null;
  additionalInfo?: string | null; // Có thể là JSON string
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  // order?: Pick<Order, 'orderId' | 'accountId'>
  // paymentMethod?: PaymentMethod
  // paymentStatus?: PaymentStatus
}

// --- Instructor Payouts & Balance ---

export interface PaymentSplit {
  splitId: number;
  paymentId: number;
  orderItemId: number;
  recipientAccountId: number; // Instructor ID
  amount: number; // Số tiền hoa hồng
  payoutId?: number | null;
  createdAt: IsoDateTimeString;
}

export interface InstructorPayoutMethod {
  payoutMethodId: number;
  accountId: number;
  methodId: string;
  details: string; // JSON string, cần parse ở FE
  isPrimary: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'REQUIRES_VERIFICATION';
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  paymentMethod?: PaymentMethod;
}

export type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'; // Gộp các trạng thái liên quan

export interface WithdrawalRequest {
  requestId: number;
  instructorId: number;
  requestedAmount: number;
  requestedCurrencyId: string;
  paymentMethodId: string; // Phương thức nhận tiền của Instructor
  payoutDetailsSnapshot: string; // JSON string chi tiết tài khoản nhận tiền tại thời điểm yêu cầu
  status: WithdrawalStatus;
  instructorNotes?: string | null;
  adminId?: number | null;
  adminNotes?: string | null;
  processedAt?: IsoDateTimeString | null;
  payoutId?: number | null; // Liên kết đến bản ghi Payout thực tế
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  // instructor?: Pick<UserProfile, 'accountId' | 'fullName'>
  // currency?: Currency
  // paymentMethod?: PaymentMethod
  // admin?: Pick<UserProfile, 'accountId' | 'fullName'>
}

export interface PayoutStatus {
  statusId: string; // 'PENDING', 'PROCESSING', 'PAID', 'FAILED'
  statusName: string;
}

export interface Payout {
  payoutId: number;
  instructorId: number;
  amount: number; // Số tiền yêu cầu gốc (theo requestedCurrencyId)
  currencyId: string; // requestedCurrencyId
  actualAmount?: number | null; // Số tiền thực tế gửi đi (có thể khác do phí, tỷ giá)
  exchangeRate?: number | null; // Tỷ giá áp dụng nếu có quy đổi
  paymentMethodId: string;
  payoutDetails?: string | null; // Thông tin tài khoản nhận tiền (có thể lấy từ snapshot)
  fee: number; // Phí giao dịch (nếu có)
  payoutStatusId: string; // 'PENDING', 'PROCESSING', etc.
  requestedAt: IsoDateTimeString; // Thời điểm yêu cầu rút gốc
  processedAt?: IsoDateTimeString | null; // Thời điểm bắt đầu xử lý
  completedAt?: IsoDateTimeString | null; // Thời điểm hoàn thành (tiền đi)
  adminId?: number | null;
  adminNote?: string | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  // instructor?: Pick<UserProfile, 'accountId' | 'fullName'>
  // currency?: Currency
  // paymentMethod?: PaymentMethod
  // payoutStatus?: PayoutStatus
  // admin?: Pick<UserProfile, 'accountId' | 'fullName'>
}

// --- Course Admin & Moderation ---

export type ApprovalRequestType =
  | 'INITIAL_SUBMISSION'
  | 'UPDATE_SUBMISSION'
  | 'FEATURE_REQUEST'; // Thêm các loại nếu cần
export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_REVISION';

export interface CourseApprovalRequest {
  requestId: number;
  courseId: number;
  instructorId: number;
  requestType: ApprovalRequestType | string; // Cho phép string nếu có loại khác
  status: ApprovalStatus;
  instructorNotes?: string | null;
  adminId?: number | null;
  adminNotes?: string | null;
  reviewedAt?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  // course?: Pick<Course, 'courseId' | 'courseName'>
  // instructor?: Pick<UserProfile, 'accountId' | 'fullName'>
  // admin?: Pick<UserProfile, 'accountId' | 'fullName'>
}

// --- Notifications, Settings, Discussions ---

export interface Notification {
  notificationId: number;
  recipientAccountId: number;
  type: string; // Ví dụ: 'COURSE_APPROVED', 'NEW_REVIEW', 'PAYOUT_COMPLETED'
  message: string;
  relatedEntityType?: string | null; // 'Course', 'Review', 'Payout'
  relatedEntityId?: string | number | null; // ID của entity liên quan
  isRead: boolean;
  createdAt: IsoDateTimeString;
  // Có thể thêm trường link để điều hướng nhanh
  // link?: string;
}

export interface Setting {
  settingKey: string;
  settingValue: string; // FE có thể cần parse giá trị này (vd: JSON, number, boolean)
  description?: string | null;
  isEditableByAdmin: boolean;
  lastUpdated: IsoDateTimeString;
}

export interface DiscussionPost {
  postId: number;
  threadId: number;
  parentPostId?: number | null;
  accountId: number;
  postText: string; // HTML content? Markdown? Plain text? Cần làm rõ
  isInstructorPost: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  author?: Pick<UserProfile, 'accountId' | 'fullName' | 'avatarUrl'>;
  replies?: DiscussionPost[]; // Hiển thị dạng cây trả lời
}

export interface DiscussionThread {
  threadId: number;
  courseId: number;
  lessonId?: number | null; // Hoặc string
  title: string;
  createdByAccountId: number;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  author?: Pick<UserProfile, 'accountId' | 'fullName' | 'avatarUrl'>;
  posts?: DiscussionPost[]; // Các bài viết/trả lời trong thread
  // lesson?: Pick<Lesson, 'lessonId' | 'lessonName'>
  // course?: Pick<Course, 'courseId' | 'courseName'>
}

// --- Instructor Balance ---

export type BalanceTransactionType =
  | 'CREDIT_SALE'
  | 'DEBIT_WITHDRAWAL'
  | 'CREDIT_REFUND'
  | 'DEBIT_FEE'
  | 'ADJUSTMENT_ADD'
  | 'ADJUSTMENT_SUB';

export interface InstructorBalanceTransaction {
  transactionId: number;
  accountId: number; // Instructor ID
  type: BalanceTransactionType;
  amount: number; // Có thể âm hoặc dương
  currencyId: string; // Thường là tiền tệ cơ sở của hệ thống
  currentBalance: number; // Số dư SAU giao dịch
  relatedEntityType?: string | null; // 'PaymentSplit', 'Payout', etc.
  relatedEntityId?: number | null;
  description?: string | null;
  transactionTimestamp: IsoDateTimeString;
  // --- Dữ liệu join tiềm năng ---
  // currency?: Currency
}

// --- Quiz Attempts ---

export interface QuizAttemptAnswer {
  attemptAnswerId: number;
  attemptId: number;
  questionId: number;
  selectedOptionId?: number | null; // ID của lựa chọn người dùng chọn
  isCorrect?: boolean | null; // Kết quả đúng/sai
  // --- Dữ liệu join tiềm năng ---
  // question?: Pick<QuizQuestion, 'questionId' | 'questionText'>
  // selectedOption?: Pick<QuizOption, 'optionId' | 'optionText' | 'isCorrectAnswer'>
}

export interface QuizAttempt {
  attemptId: number;
  lessonId: number; // Hoặc string
  accountId: number;
  startedAt: IsoDateTimeString;
  completedAt?: IsoDateTimeString | null;
  score?: number | null; // DECIMAL(5, 2) -> number
  isPassed?: boolean | null;
  attemptNumber?: number | null;
  // --- Dữ liệu join tiềm năng ---
  answers?: QuizAttemptAnswer[]; // Các câu trả lời chi tiết
  // lesson?: Pick<Lesson, 'lessonId' | 'lessonName'>
}
