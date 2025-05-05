import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "../common/Icons";

const Hero = () => {
  return (
    <div className="hero-gradient text-gray-900 dark:text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Expand Your Knowledge with AI-Enhanced Learning
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg opacity-90">
              Discover courses taught by experts and enhanced with our AI tutor
              that guides you through your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                Explore Courses
                <Icons.arrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-900 text-gray-900 hover:bg-gray-100 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Become an Instructor
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-2">
              <Icons.check className="h-5 w-5 text-gray-900 dark:text-gray-200" />
              <span className="text-gray-900 dark:text-gray-200">
                Access to 10,000+ courses
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Icons.check className="h-5 w-5 text-gray-900 dark:text-gray-200" />
              <span className="text-gray-900 dark:text-gray-200">
                Learn at your own pace
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Icons.check className="h-5 w-5 text-gray-900 dark:text-gray-200" />
              <span className="text-gray-900 dark:text-gray-200">
                AI-powered learning assistant
              </span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Students learning"
                className="w-full h-auto"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Data Science Fundamentals
                </h3>
                <p className="text-gray-700 dark:text-gray-400 mt-2">
                  Master the basics of data science and analytics
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icons.sparkles
                          key={star}
                          className="h-4 w-4 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">
                      4.9 (1,200 reviews)
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    $49.99
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-teal-500/20 dark:bg-teal-500/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -left-10 w-80 h-80 bg-brand-500/20 dark:bg-brand-500/30 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
