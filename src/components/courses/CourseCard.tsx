import { Link } from 'react-router-dom';
import { Icons } from '../common/Icons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

// =============> hiện tại ko dùng <=====================

export interface CourseType {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  discountedPrice?: number;
  thumbnail: string;
  level: string;
  duration: string;
  lessonCount: number;
}

interface CourseCardProps {
  course: CourseType;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { addItem, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInCart(course.id)) {
      addItem({
        id: course.id,
        title: course.title,
        price: course.price,
        discountedPrice: course.discountedPrice,
        instructor: course.instructor,
        thumbnail: course.thumbnail,
        slug: course.slug,
      });
    }
  };

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {course.discountedPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {Math.round((1 - course.discountedPrice / course.price) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs mr-2">
            {course.level}
          </span>
          <div className="flex items-center">
            <Icons.clock className="h-4 w-4 mr-1 text-gray-400" />
            <span>{course.duration}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {course.title}
        </h3>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          By {course.instructor}
        </div>

        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Icons.star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(course.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {course.rating.toFixed(1)} ({course.reviewCount} reviews)
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <Icons.bookOpen className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {course.lessonCount} lessons
              </span>
            </div>
          </div>
          <div className="font-bold text-gray-900 dark:text-white">
            {course.discountedPrice ? (
              <div>
                <span className="text-red-500 dark:text-red-400">
                  ${course.discountedPrice}
                </span>
                <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                  ${course.price}
                </span>
              </div>
            ) : (
              <span>${course.price}</span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isInCart(course.id)}
          >
            {isInCart(course.id) ? (
              <>
                <Icons.check className="h-4 w-4 mr-1" />
                In Cart
              </>
            ) : (
              <>
                <Icons.shoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
          <Button size="sm" className="w-full" asChild>
            <Link to={`/courses/${course.slug}`}>
              <Icons.eye className="h-4 w-4 mr-1" />
              Details
            </Link>
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
