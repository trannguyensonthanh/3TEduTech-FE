import { Icons } from '../common/Icons';

const Features = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Why Learn with 3TEduTech?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform combines expert-led courses with cutting-edge AI
            technology for a truly personalized learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="bg-brand-100 dark:bg-brand-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.sparkles className="h-8 w-8 text-brand-600 dark:text-brand-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              AI-Powered Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI learning assistant provides personalized help, answers
              questions, and guides you through challenging concepts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="bg-teal-100 dark:bg-teal-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.course className="h-8 w-8 text-teal-600 dark:text-teal-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Expert Instructors
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn from industry professionals with real-world experience who
              are passionate about sharing their knowledge.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="bg-purple-100 dark:bg-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.globe className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Learn Anywhere
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access your courses anytime, anywhere, with mobile and offline
              viewing options to fit your busy schedule.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  AI-Powered Chatbot in Every Lesson
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Our revolutionary AI chatbot is integrated directly into each
                  lesson, providing immediate assistance whenever you need it.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.check className="h-6 w-6 text-brand-500 dark:text-brand-300" />
                    </div>
                    <p className="ml-3 text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        24/7 Support:
                      </span>{' '}
                      Get help with concepts anytime, even outside of class
                      hours
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.check className="h-6 w-6 text-brand-500 dark:text-brand-300" />
                    </div>
                    <p className="ml-3 text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Personalized Learning:
                      </span>{' '}
                      The AI adapts to your learning style and pace
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.check className="h-6 w-6 text-brand-500 dark:text-brand-300" />
                    </div>
                    <p className="ml-3 text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Interactive Exercises:
                      </span>{' '}
                      Practice with AI-generated examples and problems
                    </p>
                  </li>
                </ul>
              </div>
              <div className="relative hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1612299065617-f928c5fb848d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80"
                  alt="AI learning assistant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
