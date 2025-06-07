// Tạo file `src/components/courses/CourseCard.tsx` (nếu chưa có hoặc muốn làm mới hoàn toàn).
// ```typescript
// // src/components/courses/CourseCard.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { formatDurationShort } from '@/utils/formatter.util'; // Utility định dạng thời gian
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Cho animation
// =============> hiện tại được dùng cho các card ở ngoài trang chủ <=====================
// Interface này nên đồng bộ với CourseListItem từ course.service.ts
export interface CourseCardType {
  courseId: number; // Đổi id thành courseId cho rõ ràng
  courseName: string;
  slug: string;
  instructorName: string;
  averageRating?: number | null;
  reviewCount?: number;
  originalPrice: number;
  discountedPrice?: number | null;
  thumbnailUrl?: string | null;
  levelName?: string; // Thêm từ CourseListItem
  totalDurationSeconds?: number; // Thêm từ CourseListItem
  lessonsCount?: number; // Thêm từ CourseListItem
  // Các trường khác nếu có: categoryName, isBestseller, etc.
}

interface CourseCardProps {
  course: CourseCardType;
  className?: string;
}
// Định nghĩa animation variants ngay trong file CourseCard.tsx
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 }, // Thêm scale
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5, // Tăng duration một chút
      ease: 'circOut', // Sử dụng ease khác
    },
  },
};

const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  const navigate = useNavigate();
  const displayPrice = course.discountedPrice ?? course.originalPrice;
  const hasDiscount =
    course.discountedPrice && course.discountedPrice < course.originalPrice;

  const renderStars = (rating?: number | null) => {
    if (rating == null || rating === 0) {
      return (
        <span className="text-xs text-muted-foreground">No reviews yet</span>
      );
    }
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Icons.star
            key={`full-${i}`}
            className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
          />
        ))}
        {halfStar && (
          <Icons.star
            key="half"
            className="h-3.5 w-3.5 text-yellow-400 fill-yellow-200"
          />
        )}{' '}
        {/* Cần icon half-star hoặc tùy chỉnh fill */}
        {[...Array(emptyStars)].map((_, i) => (
          <Icons.star
            key={`empty-${i}`}
            className="h-3.5 w-3.5 text-yellow-400 fill-transparent"
          />
        ))}
      </>
    );
  };

  return (
    <motion.div
      variants={cardVariants} // Áp dụng animation variants ở đây nếu list cha dùng staggerChildren
      className={cn(
        'group bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full',
        className
      )}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="block aspect-[16/9] overflow-hidden relative"
      >
        <img
          src={
            course.thumbnailUrl ||
            'https://via.placeholder.com/400x225/e0e0e0/909090?text=Course+Image'
          }
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 shadow-md text-xs px-2 py-1"
          >
            SALE{' '}
            {Math.round(
              ((course.originalPrice - (course.discountedPrice || 0)) /
                course.originalPrice) *
                100
            )}
            %
          </Badge>
        )}
        {/* (Tùy chọn) Badge Bestseller hoặc New */}
        {/* <Badge className="absolute top-3 left-3 bg-amber-400 text-amber-900">Bestseller</Badge> */}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {course.levelName && (
          <Badge
            variant="outline"
            className="mb-2 self-start text-xs py-0.5 px-1.5 border-primary/50 text-primary dark:border-primary/40 dark:text-primary/90"
          >
            {course.levelName}
          </Badge>
        )}
        <Link to={`/courses/${course.slug}`} className="block mb-1.5">
          <h3 className="text-md font-semibold leading-snug line-clamp-2 h-[42px] text-foreground group-hover:text-primary transition-colors dark:group-hover:text-primary/90">
            {course.courseName}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          By {course.instructorName}
        </p>

        <div className="flex items-center gap-1.5 mb-3">
          {course.averageRating != null && course.averageRating > 0 && (
            <span className="text-xs font-bold text-amber-500 mr-0.5 pt-px">
              {course.averageRating.toFixed(1)}
            </span>
          )}
          <div className="flex items-center">
            {renderStars(course.averageRating)}
          </div>
          {course.reviewCount != null && (
            <span className="text-xs text-muted-foreground ml-1">
              ({course.reviewCount})
            </span>
          )}
        </div>

        {/* Course Meta: Duration, Lessons */}
        <div className="flex items-center text-xs text-muted-foreground space-x-3 mb-3 mt-auto pt-2 border-t border-border/50">
          {course.lessonsCount != null && (
            <div className="flex items-center">
              <Icons.lessons className="w-3.5 h-3.5 mr-1 opacity-80" />
              <span>{course.lessonsCount} lessons</span>
            </div>
          )}
          {course.totalDurationSeconds != null &&
            course.totalDurationSeconds > 0 && (
              <div className="flex items-center">
                <Icons.clock className="w-3.5 h-3.5 mr-1 opacity-80" />
                <span>{formatDurationShort(course.totalDurationSeconds)}</span>
              </div>
            )}
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-primary dark:text-primary/90">
              ${displayPrice.toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                ${course.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          {/* Nút Add to cart/Favorite (Tùy chọn) */}
          {/* <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary -mr-2">
            <Icons.heart className="w-5 h-5" />
          </Button> */}
        </div>
      </div>
      {/* Tạm thời bỏ nút Add to Cart ở card, có thể thêm sau */}
      {/* <div className="p-4 pt-0">
         <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/5 hover:text-primary/90"
            onClick={() => console.log('Add to cart:', course.courseId)} // Sẽ tích hợp sau
        >
            <Icons.shoppingCart className="w-4 h-4 mr-2"/> Add to Cart
        </Button>
      </div> */}
    </motion.div>
  );
};

export default CourseCard;
