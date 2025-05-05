
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About 3TEduTech</h1>
            <p className="text-xl text-muted-foreground">
              Transforming education through technology and innovation.
            </p>
          </div>
          
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Founded in 2018, 3TEduTech began with a simple mission: to make high-quality education accessible to everyone. 
                What started as a small team of passionate educators and technologists has grown into a global platform 
                connecting thousands of instructors with millions of students worldwide.
              </p>
              <p>
                We believe that education is a fundamental right, and technology is the key to unlocking its potential. 
                Our platform combines cutting-edge technology with expert-led content to provide an immersive learning 
                experience that adapts to each student's unique needs.
              </p>
              <p>
                Today, 3TEduTech serves learners in over 150 countries, offering courses in dozens of languages across 
                a wide range of subjects. But despite our growth, our core mission remains unchanged: to empower individuals 
                through knowledge and skills that transform lives.
              </p>
            </div>
          </div>
          
          {/* Our Mission */}
          <div className="mb-16 bg-gray-50 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-brand-100 flex items-center justify-center">
                  <Icons.book className="w-20 h-20 text-brand-500" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg mb-4">
                  To democratize education by providing accessible, high-quality learning experiences that 
                  empower individuals and organizations to achieve their full potential.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Icons.check className="h-5 w-5 text-brand-500 mr-2 mt-1" />
                    <span>Make education accessible to anyone, anywhere</span>
                  </li>
                  <li className="flex items-start">
                    <Icons.check className="h-5 w-5 text-brand-500 mr-2 mt-1" />
                    <span>Provide practical, skills-based learning that leads to real-world results</span>
                  </li>
                  <li className="flex items-start">
                    <Icons.check className="h-5 w-5 text-brand-500 mr-2 mt-1" />
                    <span>Foster a global community of lifelong learners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Icons.users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community First</h3>
                <p className="text-muted-foreground">
                  We believe in the power of community. Our platform is built to connect students and teachers 
                  in meaningful ways that enhance the learning experience.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Icons.star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from the quality of our courses to the 
                  technology that powers our platform.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Icons.search className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly push the boundaries of what's possible in online education, using 
                  cutting-edge technology to create immersive learning experiences.
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sarah Chen',
                  title: 'CEO & Co-Founder',
                  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'David Park',
                  title: 'CTO & Co-Founder',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Michael Rodriguez',
                  title: 'Chief Product Officer',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Lisa Johnson',
                  title: 'Chief Marketing Officer',
                  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'James Wilson',
                  title: 'Chief Content Officer',
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
                {
                  name: 'Emma Garcia',
                  title: 'VP of Instructor Success',
                  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                },
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mb-16 bg-brand-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">3TEduTech by the Numbers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: '5M+', label: 'Students Worldwide' },
                { number: '10K+', label: 'Courses Available' },
                { number: '2K+', label: 'Expert Instructors' },
                { number: '150+', label: 'Countries Reached' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-brand-600 mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Start your learning journey today and discover thousands of courses taught by expert instructors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/instructor/register">Become an Instructor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
