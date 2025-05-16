/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CourseDetailPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout'; // Assume this exists
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/common/Icons'; // Assume this exists with required icons
import { useToast } from '@/hooks/use-toast'; // Assume this exists
import { useCart } from '@/contexts/CartContext'; // Assume this exists
import FreePreviewModal from '@/components/courses/FreePreviewModal'; // Assume this exists
import {
  CourseDetail,
  UserProfileBasic,
  CourseReviewQueryParams,
  CreateReviewPayload,
  UserLessonProgress,
  Section,
  Lesson,
  CourseReview,
} from '@/types/common.types'; // Đảm bảo đường dẫn và types đúng
import { useCourseDetailBySlug } from '@/hooks/queries/course.queries'; // Đảm bảo hooks tồn tại và đúng
import {
  Star,
  Clock,
  Users,
  BookOpen as CourseContentIcon,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Lock,
  ShoppingCart,
  Zap,
  CheckCircle,
  MessageSquare,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Award,
  Video as VideoIconLucide,
  FileText as TextIconLucide,
  HelpCircle as QuizIconLucide,
  Globe,
  FileIcon,
  XCircle,
  BookOpen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns'; // Để format ngày review
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext'; // Assume this exists
import { formatDurationShort } from '@/utils/formatter.util'; // Assume this exists
import {
  getYoutubeEmbedUrl,
  extractYoutubeId,
  getVimeoEmbedUrl,
  extractVimeoId,
} from '@/utils/video.util'; // Assume these exist
import { AspectRatio } from '@/components/ui/aspect-ratio';
import PaginationControls from '@/components/admin/PaginationControls'; // Assume this exists
import { useLessonVideoUrl } from '@/hooks/queries/lesson.queries'; // For FreePreviewModal
import {
  useCreateOrUpdateReview,
  useDeleteReview,
  useMyReviewForCourse,
  useReviewsByCourse,
} from '@/hooks/queries/review.queries';
import { Label } from '@/components/ui/label';
import { useAddCourseToCart, useMyCart } from '@/hooks/queries/cart.queries';
import { useInstructorPublicProfile } from '@/hooks/queries/instructor.queries';
import { Review } from '@/services/review.service';

// --- Sub-Components ---

// Curriculum Section Item
interface CurriculumSectionItemProps {
  section: Section;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onLessonClick: (lesson: Lesson) => void;
  userProgress?: { [lessonId: string]: UserLessonProgress }; // Key là lessonId (string hoặc number)
  isEnrolled: boolean;
}

const CurriculumSectionItem: React.FC<CurriculumSectionItemProps> = ({
  section,
  isExpanded,
  onToggleExpand,
  onLessonClick,
  userProgress,
  isEnrolled,
}) => {
  console.log('CurriculumSectionItem', section);
  const totalDuration = section.lessons.reduce(
    (sum, l) => sum + (l.videoDurationSeconds || 0),
    0
  );
  const getLessonIcon = (type: Lesson['lessonType']) => {
    if (type === 'VIDEO')
      return <VideoIconLucide className="h-4 w-4 text-blue-500 shrink-0" />;
    if (type === 'TEXT')
      return <TextIconLucide className="h-4 w-4 text-green-500 shrink-0" />;
    if (type === 'QUIZ')
      return <QuizIconLucide className="h-4 w-4 text-purple-500 shrink-0" />;
    return <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />;
  };
  return (
    <div className="border-b last:border-b-0">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isExpanded ? (
            <ChevronUp size={20} className="text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown size={20} className="text-muted-foreground shrink-0" />
          )}
          <h3
            className="font-semibold text-base md:text-lg truncate"
            title={section.sectionName}
          >
            {section.sectionName || 'Untitled Section'}
          </h3>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0 ml-2">
          {section.lessons.length} lessons
          {totalDuration > 0 && ` • ${formatDurationShort(totalDuration)}`}
        </div>
      </button>
      {isExpanded && (
        <div className="divide-y divide-border border-t bg-background/30 dark:bg-background/10">
          {section.lessons
            .sort((a, b) => a.lessonOrder - b.lessonOrder)
            .map((lesson) => (
              <div
                key={lesson.lessonId || lesson.tempId}
                className={`flex items-center justify-between p-3 pl-10 pr-4 transition-colors ${
                  lesson.isFreePreview || isEnrolled
                    ? 'hover:bg-primary/5 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() =>
                  (lesson.isFreePreview || isEnrolled) && onLessonClick(lesson)
                }
                title={
                  lesson.isFreePreview || isEnrolled
                    ? `View: ${lesson.lessonName}`
                    : 'Enroll to access this lesson'
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getLessonIcon(lesson.lessonType)}
                  <span
                    className="text-sm truncate flex-1"
                    title={lesson.lessonName}
                  >
                    {lesson.lessonName}
                  </span>
                  {userProgress?.[lesson.lessonId]?.isCompleted && (
                    <span title="Completed">
                      <CheckCircle
                        size={14}
                        className="text-green-500 shrink-0"
                      />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-2">
                  {lesson.isFreePreview && (
                    <Badge variant="success" className="text-xs px-1.5 py-0.5">
                      Free Preview
                    </Badge>
                  )}
                  {!(lesson.isFreePreview || isEnrolled) && (
                    <span title="Locked">
                      <Lock size={12} />
                    </span>
                  )}
                  {lesson.lessonType === 'VIDEO' &&
                    lesson.videoDurationSeconds && (
                      <span>
                        {formatDurationShort(lesson.videoDurationSeconds)}
                      </span>
                    )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Review Item
interface ReviewItemProps {
  review: Review;
  canInteract: boolean; // User hiện tại có thể xóa review này không
  onDelete: (reviewId: number) => void;
  isDeleting: boolean;
}
const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  canInteract,
  onDelete,
  isDeleting,
}) => (
  <div className="border-b py-6 last:border-b-0">
    <div className="flex items-start space-x-3 sm:space-x-4">
      <Avatar className="h-10 w-10 sm:h-11 sm:w-11">
        <AvatarImage
          src={review.userAvatar || undefined}
          alt={review.userFullName}
        />
        <AvatarFallback>
          {review.userFullName?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
          <h4 className="font-semibold text-sm">{review.userFullName}</h4>
          <span className="text-xs text-muted-foreground mt-0.5 sm:mt-0">
            {format(parseISO(review.reviewedAt), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex mt-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`mr-0.5 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-muted stroke-muted-foreground'
              }`}
            />
          ))}
        </div>
        {review.comment && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {review.comment}
          </p>
        )}
        {canInteract && (
          <Button
            variant="ghost"
            size="default"
            className="mt-2 text-xs text-destructive hover:text-destructive p-0 h-auto"
            onClick={() => onDelete(review.reviewId)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Trash2 size={12} className="mr-1" />
            )}{' '}
            Delete My Review
          </Button>
        )}
      </div>
    </div>
  </div>
);

// Review Form
interface ReviewFormProps {
  courseId: number;
  currentMyReview: Review | null | undefined; // Review hiện tại của user (nếu có)
  onSubmitSuccess: () => void;
}
const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  currentMyReview,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  const { mutate: submitReview, isPending } = useCreateOrUpdateReview();

  useEffect(() => {
    if (currentMyReview) {
      setRating(currentMyReview.rating || 0);
      setComment(currentMyReview.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [currentMyReview]);

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating.',
        variant: 'destructive',
      });
      return;
    }
    submitReview(
      { courseId, data: { rating, comment: comment.trim() || undefined } },
      {
        onSuccess: () => {
          onSubmitSuccess();
        }, // Parent sẽ handle toast và refetch
        onError: (error) => {
          toast({
            title: 'Submission Failed',
            description: error.message || 'Could not submit review.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 border rounded-lg bg-card shadow-sm">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">
        {currentMyReview ? 'Update Your Review' : 'Write a Review'}
      </h3>
      <div className="mb-4">
        <Label className="block mb-1.5 text-sm font-medium">Your Rating*</Label>
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 p-0 hover:scale-110 transition-transform ${
                (hoverRating || rating) >= star
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                size={20}
                className={
                  (hoverRating || rating) >= star
                    ? 'fill-current'
                    : 'fill-muted stroke-muted-foreground'
                }
              />
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <Label
          htmlFor="reviewComment"
          className="block mb-1.5 text-sm font-medium"
        >
          Your Review (Optional)
        </Label>
        <Textarea
          id="reviewComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about the course..."
          rows={4}
          className="resize-none"
        />
      </div>
      <Button onClick={handleSubmitReview} disabled={isPending || rating === 0}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {currentMyReview ? 'Update Review' : 'Submit Review'}
      </Button>
    </div>
  );
};

// --- Main Course Detail Page Component ---
const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set()
  );
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState('overview');

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch: refetchCourseDetail,
  } = useCourseDetailBySlug(slug);
  const { data: cartData, refetch: refetchCart } = useMyCart({
    enabled: !!userData,
  });
  const { mutate: addCourseToCartMutate, isPending: isAddingToCart } =
    useAddCourseToCart();
  const [reviewPage, setReviewPage] = useState(1);
  const reviewLimit = 5;
  const reviewQueryParams: CourseReviewQueryParams = useMemo(
    () => ({
      courseId: Number(course?.courseId),
      page: reviewPage,
      limit: reviewLimit,
      sortBy: 'reviewedAt_desc',
    }),
    [course?.courseId, reviewPage]
  );

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useReviewsByCourse(
    course?.courseId ? Number(course.courseId) : undefined,
    reviewQueryParams,
    { enabled: !!course?.courseId && activeContentTab === 'reviews' }
  );
  const {
    data: myReview,
    isLoading: isLoadingMyReview,
    refetch: refetchMyReview,
  } = useMyReviewForCourse(
    userData && course?.courseId ? Number(course.courseId) : undefined,
    { enabled: !!userData && !!course?.courseId }
  );
  const { mutate: deleteReviewMutate, isPending: isDeletingReview } =
    useDeleteReview();
  const { data: instructorProfile, isLoading: isLoadingInstructor } =
    useInstructorPublicProfile(course?.instructorId, {
      enabled: !!course?.instructorId && activeContentTab === 'instructor',
    });
  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => {
      const n = new Set(prev);
      if (n.has(sectionId)) n.delete(sectionId);
      else n.add(sectionId);
      return n;
    });
  };
  const handleLessonClick = (lesson: Lesson) => {
    console.log('Lesson clicked:', lesson);
    if (lesson.isFreePreview) {
      setPreviewLesson(lesson);
      setIsPreviewModalOpen(true);
    } else if (course?.isEnrolled) {
      navigate(
        `/learn/${course.slug}/sections/${Number(
          lesson.sectionId
        )}/lessons/${Number(lesson.lessonId)}`
      );
    } else {
      toast({
        title: 'Content Locked',
        description: 'Enroll in the course to access this lesson.',
      });
    }
  };

  const handleAddToCart = () => {
    if (!userData) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add courses to your cart.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: location.pathname } }); // Điều hướng đến login
      return;
    }
    if (course && !isAddingToCart) {
      addCourseToCartMutate(Number(course.courseId), {
        onSuccess: (data) => {
          toast({
            title: 'Added to Cart',
            description: data.message || `"${course.courseName}" added.`,
          });
          refetchCart(); // React Query sẽ tự cập nhật cache dựa trên setQueryData trong hook
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description:
              error.response?.data?.message ||
              error.message ||
              'Could not add to cart.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleBuyNow = () => {
    if (!userData) {
      toast({
        title: 'Login Required',
        description: 'Please log in to enroll.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (course) {
      // Nếu chưa có trong giỏ, thêm vào giỏ trước
      const alreadyInCart = cartData?.items.some(
        (item) => item.courseId === Number(course.courseId)
      );
      if (!alreadyInCart) {
        addCourseToCartMutate(Number(course.courseId), {
          onSuccess: () => {
            // Sau khi thêm thành công, điều hướng
            navigate('/checkout');
          },
          onError: (error: any) => {
            toast({
              title: 'Error Adding to Cart',
              description: error.response?.data?.message || error.message,
              variant: 'destructive',
            });
          },
        });
      } else {
        // Nếu đã có trong giỏ, điều hướng thẳng
        navigate('/checkout');
      }
    }
  };

  const handleDeleteMyReview = (reviewId: number) => {
    if (!course?.courseId) return;
    if (window.confirm('Delete your review? This cannot be undone.')) {
      deleteReviewMutate(
        { courseId: Number(course.courseId), reviewId },
        {
          onSuccess: () => {
            refetchCourseDetail();
            refetchMyReview();
            refetchReviews();
          }, // Refetch tất cả cho chắc
        }
      );
    }
  };

  const handleReviewSubmitSuccess = () => {
    refetchCourseDetail(); // Update avg rating, count
    refetchMyReview(); // Update my review
    if (activeContentTab === 'reviews') refetchReviews(); // Update list if tab active
  };

  const isAddedToCart = useMemo(() => {
    if (!userData || !cartData || !course) return false;
    return cartData.items.some(
      (item) => item.courseId === Number(course.courseId)
    );
  }, [userData, cartData, course]);

  // --- Signed URL cho Intro Video ---
  const [signedIntroVideoUrl, setSignedIntroVideoUrl] = useState<string | null>(
    null
  );
  // Giả sử intro video cũng là một "lesson" đặc biệt hoặc có API riêng để lấy signed URL
  // Ví dụ: const { data: introVideoSignedData } = useLessonVideoUrl(course?.introVideoLessonId, { enabled: !!course?.introVideoLessonId && course?.introVideoSource === 'CLOUDINARY' });
  // useEffect(() => { setSignedIntroVideoUrl(introVideoSignedData?.signedUrl || course?.introVideoUrl || null) }, [introVideoSignedData, course?.introVideoUrl]);
  // Tạm thời, nếu introVideoUrl không phải YT/Vimeo, ta giả định nó là public hoặc Cloudinary public_id cần signed URL (logic này phức tạp hơn)
  // Hiện tại, ta sẽ dùng trực tiếp introVideoUrl, bạn cần đảm bảo URL này có thể truy cập được hoặc fetch signed URL nếu cần.

  useEffect(() => {
    // Logic để lấy signed URL cho course.introVideoUrl nếu nó là Cloudinary private
    // Hiện tại, ta sẽ gán trực tiếp nếu nó là URL, hoặc bạn cần fetch riêng
    if (
      course?.introVideoUrl &&
      !course.introVideoUrl.includes('youtube.com') &&
      !course.introVideoUrl.includes('vimeo.com') &&
      !course.introVideoUrl.startsWith('blob:')
    ) {
      // Nếu đây là public_id của Cloudinary, bạn cần một cơ chế fetch signed URL
      // Ví dụ: setSignedIntroVideoUrl( fetchedSignedUrlForIntro );
      // Tạm thời hiển thị URL gốc
      setSignedIntroVideoUrl(course.introVideoUrl);
    } else if (course?.introVideoUrl) {
      setSignedIntroVideoUrl(course.introVideoUrl); // Cho YT/Vimeo
    } else {
      setSignedIntroVideoUrl(null);
    }
  }, [course?.introVideoUrl]);

  if (isLoading || !slug) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </Layout>
    );
  }
  if (isError || !course) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            "{slug}" could not be found.
          </p>
          <Button asChild className="mt-6">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentPrice = course.discountedPrice ?? course.originalPrice;
  const discountPercent =
    course.originalPrice > 0 &&
    course.discountedPrice &&
    course.discountedPrice < course.originalPrice
      ? Math.round(
          ((course.originalPrice - course.discountedPrice) /
            course.originalPrice) *
            100
        )
      : 0;

  const heroVideoOrImage = () => {
    const videoSource = signedIntroVideoUrl || course.introVideoUrl; // Ưu tiên signed URL nếu có

    if (videoSource) {
      if (
        videoSource.includes('youtube.com') ||
        videoSource.includes('vimeo.com')
      ) {
        const embedUrl = videoSource.includes('youtube.com')
          ? getYoutubeEmbedUrl(extractYoutubeId(videoSource) || '')
          : getVimeoEmbedUrl(extractVimeoId(videoSource) || '');
        return (
          <iframe
            src={embedUrl || undefined} // Handle null case for src
            title={`Intro to ${course.courseName}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        );
      }
      // Nếu là Cloudinary (hoặc direct link)
      return (
        <video
          src={videoSource}
          controls
          className="w-full h-full object-cover"
          poster={course.thumbnailUrl || undefined}
        />
      );
    }
    if (course.thumbnailUrl) {
      return (
        <img
          src={course.thumbnailUrl}
          alt="Course preview"
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
        No preview available
      </div>
    );
  };
  console.log('CourseDetailPage', course);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-3">
                <Link
                  to={`/categories/${
                    course.categoryId ||
                    course.categoryName.toLowerCase().replace(/\s+/g, '-')
                  }`}
                  className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  {course.categoryName}
                </Link>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-400">
                  {course.levelName}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4 leading-tight">
                {course.courseName}
              </h1>
              {course.shortDescription && (
                <div
                  className="text-lg text-gray-300 mb-5 max-w-3xl"
                  dangerouslySetInnerHTML={{ __html: course.shortDescription }}
                />
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm">
                {typeof course.averageRating === 'number' && (
                  <div className="flex items-center">
                    <span className="mr-1 font-semibold text-yellow-400">
                      {course.averageRating.toFixed(1)}
                    </span>{' '}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`mr-0.5 ${
                          i < Math.round(course.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-600 text-gray-600'
                        }`}
                      />
                    ))}{' '}
                    <span className="ml-1.5 text-gray-400">
                      ({(course.reviewCount || 0).toLocaleString()} ratings)
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <Users size={16} className="mr-1.5" />{' '}
                  {(course.studentCount || 0).toLocaleString()} students
                </div>
              </div>
              <div className="flex items-center text-sm mb-3">
                <Link
                  to={`/instructors/${instructorProfile?.accountId}`}
                  className="flex items-center group"
                >
                  <Avatar className="h-9 w-9 mr-2.5 border-2 border-slate-700 group-hover:border-sky-400 transition-all">
                    <AvatarImage
                      src={course.instructorAvatar || undefined}
                      alt={course.instructorName}
                    />
                    <AvatarFallback>
                      {course.instructorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sky-400 group-hover:text-sky-200">
                    By {course.instructorName}
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center">
                  <Clock size={13} className="mr-1" />
                  Last updated{' '}
                  {format(
                    parseISO(course.createdAt || course.updatedAt),
                    'MM/yyyy'
                  )}
                </span>
                <span className="flex items-center">
                  <Globe size={13} className="mr-1" />
                  {course.language}
                </span>{' '}
                {/* Assume language is code, need to map to name if available */}
              </div>
            </div>

            <aside className="lg:col-span-1 relative">
              <div className="lg:sticky lg:top-24 bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  {heroVideoOrImage()}
                </AspectRatio>
                <div className="p-5 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${currentPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-base text-muted-foreground line-through">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                    )}{' '}
                    {discountPercent > 0 && (
                      <Badge variant="destructive">-{discountPercent}%</Badge>
                    )}
                  </div>
                  {course.isEnrolled ? (
                    <Button className="w-full h-12 text-base" size="lg" asChild>
                      <Link
                        to={`/learn/${course.slug}/sections/${Number(
                          course.sections[0].sectionId
                        )}/lessons/${Number(
                          course.sections[0].lessons[0].lessonId
                        )}`}
                      >
                        {' '}
                        <PlayCircle className="mr-2 h-5 w-5" /> Go to Course{' '}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="w-full h-12 text-base"
                        size="lg"
                        onClick={handleBuyNow}
                      >
                        Enroll Now
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={handleAddToCart}
                        disabled={isAddedToCart || isAddingToCart}
                      >
                        {isAddingToCart ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isAddedToCart ? (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <ShoppingCart className="mr-2 h-4 w-4" />
                        )}
                        {isAddingToCart
                          ? 'Adding...'
                          : isAddedToCart
                          ? 'In Cart'
                          : 'Add to Cart'}
                      </Button>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    30-Day Money-Back Guarantee
                  </p>
                  <div className="text-xs space-y-1.5 pt-3 border-t">
                    <h4 className="font-medium mb-1.5 text-sm">
                      This course includes:
                    </h4>
                    {course?.totalDuration && (
                      <p className="flex items-center">
                        <Clock
                          size={14}
                          className="mr-1.5 text-muted-foreground"
                        />
                        {formatDurationShort(course.totalDuration)} on-demand
                        video
                      </p>
                    )}
                    {course.totalDuration && (
                      <p className="flex items-center">
                        <CourseContentIcon
                          size={14}
                          className="mr-1.5 text-muted-foreground"
                        />
                        {course.totalLessons} lessons & resources
                      </p>
                    )}
                    <p className="flex items-center">
                      <Zap size={14} className="mr-1.5 text-muted-foreground" />
                      Full lifetime access
                    </p>

                    <p className="flex items-center">
                      <Award
                        size={14}
                        className="mr-1.5 text-muted-foreground"
                      />
                      Certificate of completion
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
          <main className="lg:col-span-2">
            <Tabs
              value={activeContentTab}
              onValueChange={setActiveContentTab}
              className="w-full"
            >
              <TabsList className="mb-6 sticky top-[calc(var(--header-height,64px)+1rem)] bg-background/80 backdrop-blur-sm z-10 py-2 px-1.5 border rounded-lg shadow-sm grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
                <TabsTrigger value="overview" className="text-sm h-9">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="text-sm h-9">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="instructor" className="text-sm h-9">
                  Instructor
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm h-9">
                  Reviews ({course.reviewCount || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {course.learningOutcomes && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                      What you'll learn
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {(typeof course.learningOutcomes === 'string'
                        ? course.learningOutcomes
                            .split('\n')
                            .filter((s) => s.trim() !== '')
                        : course.learningOutcomes
                      ).map((outcome: string, index: number) => (
                        <div key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2.5 mt-0.5 shrink-0" />{' '}
                          <span dangerouslySetInnerHTML={{ __html: outcome }} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                {course.requirements && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                      Requirements
                    </h2>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: course.requirements }}
                    />
                  </section>
                )}
                {course.fullDescription && (
                  <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                      Description
                    </h2>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: course.fullDescription,
                      }}
                    />
                  </section>
                )}
              </TabsContent>

              <TabsContent value="curriculum">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-2 border-b gap-2">
                  <h2 className="text-2xl font-semibold">Course Content</h2>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {course.sections.length} sections • {course.totalLessons}{' '}
                    lessons • {formatDurationShort(course.totalDuration)}
                  </div>
                </div>
                {course.isEnrolled && (
                  <div className="mb-6">
                    <Button asChild size="lg">
                      <Link
                        to={`/learn/${course.slug}/sections/${Number(
                          course.sections[0].sectionId
                        )}/lessons/${Number(
                          course.sections[0].lessons[0].lessonId
                        )}`}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" /> Continue
                        Learning
                      </Link>
                    </Button>
                  </div>
                )}
                {course.sections.length > 0 ? (
                  <div className="border rounded-lg divide-y divide-border overflow-hidden shadow-sm">
                    {course.sections
                      .sort((a, b) => a.sectionOrder - b.sectionOrder)
                      .map((section) => (
                        <CurriculumSectionItem
                          key={section.sectionId}
                          section={section}
                          isExpanded={expandedSections.has(section.sectionId)}
                          onToggleExpand={() =>
                            toggleSection(section.sectionId)
                          }
                          onLessonClick={handleLessonClick}
                          userProgress={course.userProgress}
                          isEnrolled={course.isEnrolled}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Curriculum is not available yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="instructor">
                <div className="p-4 sm:p-6 border rounded-lg bg-card shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                    <Link to={`/instructors/${course.instructorId}`}>
                      <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20 hover:scale-105 transition-transform">
                        <AvatarImage
                          src={course.instructorAvatar || undefined}
                          alt={course.instructorName}
                        />
                        <AvatarFallback className="text-3xl sm:text-4xl">
                          {course.instructorName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/instructors/${instructorProfile?.accountId}`}
                        className="hover:underline"
                      >
                        <h3 className="text-xl sm:text-2xl font-bold text-primary">
                          {course.instructorName}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {instructorProfile?.professionalTitle || 'Instructor'}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
                        {typeof course.averageRating === 'number' && (
                          <span className="flex items-center">
                            <Star size={14} className="mr-1 text-yellow-400" />{' '}
                            {course.averageRating.toFixed(1)} Instructor Rating
                          </span>
                        )}
                        {typeof course.studentCount === 'number' && (
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />{' '}
                            {course.studentCount.toLocaleString()} Students
                          </span>
                        )}
                        {typeof instructorProfile?.totalCourses ===
                          'number' && (
                          <span className="flex items-center">
                            <BookOpen size={14} className="mr-1" />{' '}
                            {instructorProfile?.totalCourses} Courses
                          </span>
                        )}
                      </div>
                      {instructorProfile?.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                          {instructorProfile?.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* About Me của Instructor (nếu có) */}
                  {instructorProfile?.aboutMe && (
                    <div
                      className="mt-6 pt-4 border-t prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: instructorProfile?.aboutMe,
                      }}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                  Student Feedback
                </h2>
                {reviewsData && reviewsData.averageRating !== null && (
                  <div className="mb-8 p-4 sm:p-6 bg-muted/50 rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-left shrink-0">
                      <div className="text-5xl font-bold text-yellow-500">
                        {reviewsData.averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center sm:justify-start mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={`mr-0.5 ${
                              i < Math.round(reviewsData.averageRating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overall Rating
                      </p>
                    </div>
                    {/* TODO: Rating Distribution Bars (nếu API trả về) */}
                  </div>
                )}

                {userData && course.isEnrolled && (
                  <div className="mb-8">
                    {' '}
                    <ReviewForm
                      courseId={Number(course.courseId)}
                      currentMyReview={myReview}
                      onSubmitSuccess={handleReviewSubmitSuccess}
                    />{' '}
                  </div>
                )}
                {!userData && (
                  <p className="mb-6 text-sm text-muted-foreground">
                    {' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Log in
                    </Link>{' '}
                    to leave a review.{' '}
                  </p>
                )}
                {!course.isEnrolled && userData && (
                  <p className="mb-6 text-sm text-muted-foreground">
                    You must be enrolled in this course to leave a review.
                  </p>
                )}

                {isLoadingReviews ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton
                        key={`rev-skel-${i}`}
                        className="h-24 w-full rounded-md"
                      />
                    ))}
                  </div>
                ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsData.reviews.map((review) => (
                      <ReviewItem
                        key={review.reviewId}
                        review={review}
                        canInteract={userData?.id === review.accountId}
                        onDelete={handleDeleteMyReview}
                        isDeleting={
                          isDeletingReview &&
                          myReview?.reviewId === review.reviewId
                        }
                      />
                    ))}
                    {reviewsData.totalPages > 1 && (
                      <div className="flex justify-center pt-4">
                        <PaginationControls
                          currentPage={reviewPage}
                          totalPages={reviewsData.totalPages}
                          setCurrentPage={setReviewPage}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first!
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar (Price Card - hiển thị lại cho sticky trên mobile khi cuộn xuống) */}
          <aside className="lg:hidden sticky top-20 mt-8 lg:mt-0">
            <div className="bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden">
              {/* ... (Nội dung Price Card giống hệt ở Hero Section) ... */}
              <div className="p-5 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-base text-muted-foreground line-through">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                  )}{' '}
                  {discountPercent > 0 && (
                    <Badge variant="destructive">-{discountPercent}%</Badge>
                  )}
                </div>
                {course.isEnrolled ? (
                  <Button className="w-full h-12 text-base" size="lg" asChild>
                    <Link
                      to={`/learn/${course.slug}/sections/${Number(
                        course.sections[0].sectionId
                      )}/lessons/${Number(
                        course.sections[0].lessons[0].lessonId
                      )}`}
                    >
                      {' '}
                      <PlayCircle className="mr-2 h-5 w-5" /> Go to Course{' '}
                    </Link>
                  </Button>
                ) : (
                  <>
                    {' '}
                    <Button
                      className="w-full h-12 text-base"
                      size="lg"
                      onClick={handleBuyNow}
                    >
                      Enroll Now
                    </Button>{' '}
                    <Button
                      variant="outline"
                      className="w-full h-11"
                      onClick={handleAddToCart}
                      disabled={isAddedToCart}
                    >
                      {isAddedToCart ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>{' '}
                  </>
                )}
                <p className="text-xs text-muted-foreground text-center">
                  30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FreePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        lesson={previewLesson}
      />
    </Layout>
  );
};

export default CourseDetailPage;
