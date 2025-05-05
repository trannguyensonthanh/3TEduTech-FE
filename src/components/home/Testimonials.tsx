import { Icons } from '../common/Icons';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    quote:
      'The AI chatbot in each lesson is a game-changer. Whenever I got stuck, it was there to help me understand complex concepts.',
    name: 'Michael Thompson',
    title: 'Software Developer',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    quote:
      "I've tried many online learning platforms, but 3TEduTech's personalized approach and expert instructors stand out from the rest.",
    name: 'Jessica Park',
    title: 'Marketing Director',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    quote:
      'The quality of courses on 3TEduTech is exceptional. I was able to apply what I learned immediately in my job.',
    name: 'Robert Chen',
    title: 'Data Scientist',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            What Our Students Say
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hear from our students who have transformed their learning
            experience with 3TEduTech
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm"
            >
              <div className="text-brand-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Icons.sparkles
                    key={i}
                    className="inline-block h-5 w-5 text-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm p-10">
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Join over 100,000 students already learning with us
          </div>
          <div className="flex flex-wrap justify-center gap-10 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">
                100K+
              </div>
              <div className="text-gray-500 dark:text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">2K+</div>
              <div className="text-gray-500 dark:text-gray-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">150+</div>
              <div className="text-gray-500 dark:text-gray-400">
                Instructors
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">98%</div>
              <div className="text-gray-500 dark:text-gray-400">
                Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
