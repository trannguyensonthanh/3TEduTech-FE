
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Icons } from '../common/Icons';

const CallToAction = () => {
  return (
    <section className="hero-gradient text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of students who are already learning and growing with our AI-enhanced courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
              Get Started For Free
              <Icons.arrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Courses
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80">
            No credit card required. Start with a free account today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
