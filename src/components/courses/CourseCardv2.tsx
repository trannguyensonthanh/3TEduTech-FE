// src/components/courses/CourseCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock, Zap, BookOpen, Award } from 'lucide-react';
import { formatDurationShort } from '@/utils/formatter.util'; // Tạo hàm này
import { CourseListItem } from '@/services/course.service';

interface CourseCardProps {
  course: CourseListItem;
}

const CourseCardv2: React.FC<CourseCardProps> = ({ course }) => {
  const displayPrice =
    course.discountedPrice !== null &&
    course.discountedPrice < course.originalPrice
      ? course.discountedPrice
      : course.originalPrice;

  const discountPercentage =
    course.originalPrice > 0 &&
    course.discountedPrice !== null &&
    course.discountedPrice < course.originalPrice
      ? Math.round(
          ((course.originalPrice - course.discountedPrice) /
            course.originalPrice) *
            100
        )
      : 0;

  const placeholderImage = `https://via.placeholder.com/600x338?text=${encodeURIComponent(
    course.courseName
  )}`;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <div className="aspect-[16/9] relative overflow-hidden bg-muted">
          {' '}
          {/* aspect-video hoặc 16/9 */}
          <img
            src={course.thumbnailUrl || placeholderImage}
            alt={course.courseName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = placeholderImage)} // Fallback nếu ảnh lỗi
          />
          {/* Badges trên ảnh */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-[1]">
            {course.isFeatured && (
              <Badge className="bg-pink-600 hover:bg-pink-700 text-white text-xs shadow">
                <Zap size={12} className="mr-1" /> Featured
              </Badge>
            )}
            {course.bestSeller && !course.isFeatured && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs shadow">
                Bestseller
              </Badge>
            )}
            {course.originalPrice === 0 && (
              <Badge variant="success" className="text-xs shadow">
                FREE
              </Badge>
            )}
          </div>
          {discountPercentage > 0 && course.originalPrice > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white rounded-md px-1.5 py-0.5 text-xs font-semibold shadow">
              -{discountPercentage}%
            </div>
          )}
        </div>

        <CardHeader className="p-3 md:p-4 pb-2">
          <div className="flex justify-between items-start mb-1">
            <Badge
              variant="outline"
              className="text-xs font-normal truncate max-w-[60%]"
              title={course.categoryName}
            >
              {course.categoryName}
            </Badge>
            {typeof course.averageRating === 'number' &&
              course.averageRating > 0 && (
                <div className="flex items-center text-xs">
                  <Star className="h-3.5 w-3.5 text-yellow-400 mr-0.5" />
                  <span className="font-semibold">
                    {course.averageRating.toFixed(1)}
                  </span>
                  {typeof course.reviewCount === 'number' && (
                    <span className="text-muted-foreground ml-0.5">
                      ({course.reviewCount})
                    </span>
                  )}
                </div>
              )}
          </div>
          <CardTitle
            className="text-base font-semibold leading-snug line-clamp-2 h-[3em] hover:text-primary transition-colors"
            title={course.courseName}
          >
            {course.courseName}
          </CardTitle>
          <p
            className="text-xs text-muted-foreground pt-0.5 truncate"
            title={course.instructorName}
          >
            By {course.instructorName}
          </p>
        </CardHeader>

        <CardContent className="p-3 md:p-4 pt-1 text-xs text-muted-foreground flex-grow">
          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
            {typeof course.totalDurationSeconds === 'number' &&
              course.totalDurationSeconds > 0 && (
                <span className="flex items-center whitespace-nowrap">
                  <Clock size={13} className="mr-1" />{' '}
                  {formatDurationShort(course.totalDurationSeconds)}
                </span>
              )}
            {typeof course.lessonsCount === 'number' && (
              <span className="flex items-center whitespace-nowrap">
                <BookOpen size={13} className="mr-1" /> {course.lessonsCount}{' '}
                lessons
              </span>
            )}
            {course.levelName && (
              <span className="capitalize whitespace-nowrap">
                • {course.levelName}
              </span>
            )}
          </div>
          {course.hasCertificate && ( // Kiểm tra nếu API trả về
            <div className="mt-2 flex items-center text-green-700 dark:text-green-400 text-xs">
              <Award size={14} className="mr-1" /> Certificate of Completion
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 md:p-4 pt-2 border-t mt-auto">
          <div className="flex justify-between items-center w-full">
            {displayPrice === 0 ? (
              <span className="text-xl font-bold text-green-600">FREE</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold">
                  ${displayPrice.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center text-xs text-muted-foreground">
              <Users size={14} className="mr-1" />
              {course.studentCount?.toLocaleString() || 0}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCardv2;
