import { Link } from 'react-router-dom';
import { Icons } from '../common/Icons';

// Sample category data
const categories = [
  {
    id: 1,
    name: 'Programming',
    count: 350,
    icon: 'laptop',
    color: 'bg-blue-100 text-blue-600',
    slug: 'programming',
  },
  {
    id: 2,
    name: 'Business',
    count: 275,
    icon: 'settings',
    color: 'bg-green-100 text-green-600',
    slug: 'business',
  },
  {
    id: 3,
    name: 'Data Science',
    count: 180,
    icon: 'globe',
    color: 'bg-purple-100 text-purple-600',
    slug: 'data-science',
  },
  {
    id: 4,
    name: 'Design',
    count: 220,
    icon: 'image',
    color: 'bg-pink-100 text-pink-600',
    slug: 'design',
  },
  {
    id: 5,
    name: 'Marketing',
    count: 195,
    icon: 'sparkles',
    color: 'bg-orange-100 text-orange-600',
    slug: 'marketing',
  },
  {
    id: 6,
    name: 'Language Learning',
    count: 140,
    icon: 'globe',
    color: 'bg-teal-100 text-teal-600',
    slug: 'language-learning',
  },
  {
    id: 7,
    name: 'Personal Development',
    count: 210,
    icon: 'user',
    color: 'bg-indigo-100 text-indigo-600',
    slug: 'personal-development',
  },
  {
    id: 8,
    name: 'AI & Machine Learning',
    count: 160,
    icon: 'sparkles',
    color: 'bg-red-100 text-red-600',
    slug: 'ai-machine-learning',
  },
];

const renderIcon = (iconName: string) => {
  const IconComponent =
    iconName === 'laptop'
      ? Icons.laptop
      : iconName === 'settings'
      ? Icons.settings
      : iconName === 'globe'
      ? Icons.globe
      : iconName === 'image'
      ? Icons.image
      : iconName === 'sparkles'
      ? Icons.sparkles
      : iconName === 'user'
      ? Icons.user
      : Icons.help;

  return <IconComponent className="h-6 w-6" />;
};

const Categories = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Explore Top Categories
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular course categories and find the perfect fit
            for your learning goals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div
                className={`${category.color} dark:bg-opacity-80 p-4 rounded-full mb-4`}
              >
                {renderIcon(category.icon)}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {category.count} courses
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/categories"
            className="text-brand-500 dark:text-brand-400 font-medium hover:text-brand-600 dark:hover:text-brand-500 inline-flex items-center"
          >
            View All Categories
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
