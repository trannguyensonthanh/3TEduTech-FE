// src/pages/AboutPage.tsx
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons'; // Cần: BookOpen, CheckCircle, Target, Users, Star, BrainCircuit, Lightbulb, HeartHandshake (hoặc tương tự)
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1], delay: 0.2 },
  },
};

// Mock Data (giữ lại và cải thiện nội dung)
const leadershipTeam = [
  {
    name: 'Dr. Evelyn Reed',
    title: 'CEO & Co-Founder',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&w=200&h=200',
    bio: 'Visionary leader pasiónnately driving educational innovation through technology.',
  },
  {
    name: 'Marcus Chen',
    title: 'CTO & Co-Founder',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&w=200&h=200',
    bio: 'Tech architect transforming learning experiences with cutting-edge AI solutions.',
  },
  {
    name: 'Aisha Khan',
    title: 'Chief Product Officer',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&w=200&h=200',
    bio: 'Strategist dedicated to crafting intuitive and impactful learning products.',
  },
  {
    name: 'Dr. Ben Carter',
    title: 'Head of Learning & Pedagogy',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&w=200&h=200',
    bio: 'Expert in educational science, ensuring effective and engaging course content.',
  },
];

const platformStats = [
  {
    icon: <Icons.students className="w-10 h-10" />,
    number: '5M+',
    label: 'Learners Worldwide',
    color: 'text-blue-500',
  },
  {
    icon: <Icons.courses className="w-10 h-10" />,
    number: '10K+',
    label: 'Curated Courses',
    color: 'text-green-500',
  },
  {
    icon: <Icons.instructors className="w-10 h-10" />,
    number: '2K+',
    label: 'Expert Instructors',
    color: 'text-purple-500',
  },
  {
    icon: <Icons.globe className="w-10 h-10" />,
    number: '150+',
    label: 'Countries Reached',
    color: 'text-red-500',
  },
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-slate-900 via-indigo-800 to-purple-900 text-white pt-20 pb-16 md:pt-32 md:pb-24 text-center overflow-hidden"
      >
        {/* Background abstract shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl animate-pulse-slower animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-teal-400 rounded-full filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-green-400">
              3TEduTech
            </span>
          </motion.h1>
          <motion.p
            custom={0.2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto"
          >
            Empowering learners and educators worldwide through innovative
            technology and accessible, high-quality education.
          </motion.p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16 md:mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-8 text-slate-800 dark:text-slate-100 text-center md:text-left"
            >
              Our Journey
            </motion.h2>
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <motion.p variants={itemVariants}>
                Founded in 2020 with a bold vision, 3TEduTech emerged from a
                desire to revolutionize how knowledge is shared and acquired.
                What began as a dedicated team of educators, AI specialists, and
                technologists has rapidly evolved into a dynamic global
                platform, fostering a vibrant community of instructors and
                millions of eager learners across the globe.
              </motion.p>
              <motion.p variants={itemVariants}>
                We firmly believe that education is a catalyst for
                transformation, and technology is the enabler to unlock its
                boundless potential. Our platform ingeniously fuses cutting-edge
                AI with expertly-curated content, delivering an immersive and
                adaptive learning experience tailored to the unique pace and
                style of each individual.
              </motion.p>
              <motion.p variants={itemVariants}>
                Today, 3TEduTech proudly serves a diverse community spanning
                over 150 countries, offering a rich tapestry of courses in
                numerous languages across a multitude of disciplines. Yet,
                amidst our expansion, our foundational mission remains
                steadfast: to empower individuals with transformative knowledge
                and future-ready skills.
              </motion.p>
            </div>
          </motion.section>

          {/* Our Mission & Vision */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16 md:mb-20 bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 rounded-2xl shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div variants={itemVariants}>
                <div className="flex items-center text-blue-600 dark:text-blue-400 mb-3">
                  <Icons.target className="w-8 h-8 mr-3" />{' '}
                  {/* Giả sử có Icons.target */}
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  To democratize education by providing universally accessible,
                  AI-enhanced learning experiences that empower individuals and
                  organizations to achieve their highest potential and shape a
                  better future.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  {[
                    'Make world-class education available to anyone, anywhere, anytime.',
                    'Deliver practical, skills-based learning for tangible real-world impact.',
                    'Cultivate a supportive and collaborative global community of lifelong learners.',
                    'Continuously innovate to make learning more engaging, effective, and personalized.',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <Icons.checkCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2.5 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={itemVariants} className="mt-8 md:mt-0">
                <div className="flex items-center text-purple-600 dark:text-purple-400 mb-3">
                  <Icons.eye className="w-8 h-8 mr-3" />{' '}
                  {/* Giả sử có Icons.eye */}
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Our Vision
                  </h2>
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  To be the leading global platform where technology and human
                  expertise converge, creating a future where learning knows no
                  bounds and everyone has the power to transform their lives
                  through education.
                </p>
                {/* Optional: Image for Vision */}
                {/* <motion.img variants={imageVariants} src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800" alt="Our Vision" className="mt-6 rounded-lg shadow-md" /> */}
              </motion.div>
            </div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16 md:mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-slate-800 dark:text-slate-100 text-center"
            >
              Our Core Values
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <Icons.users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  ),
                  title: 'Learner-Centric',
                  description:
                    'We place learners at the heart of everything, tailoring experiences to their needs and aspirations.',
                  bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                },
                {
                  icon: (
                    <Icons.lightbulb className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                  ),
                  title: 'Innovation',
                  description:
                    'We constantly explore and implement cutting-edge AI and pedagogical approaches to enhance learning.',
                  bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                },
                {
                  icon: (
                    <Icons.star className="w-8 h-8 text-green-500 dark:text-green-400" />
                  ),
                  title: 'Excellence',
                  description:
                    'We are committed to the highest standards in course quality, platform performance, and support services.',
                  bgColor: 'bg-green-100 dark:bg-green-900/30',
                },
                {
                  icon: (
                    <Icons.globe className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                  ),
                  title: 'Accessibility',
                  description:
                    'We strive to make education barrier-free, ensuring our platform is usable and affordable for all.',
                  bgColor: 'bg-purple-100 dark:bg-purple-900/30',
                },
                {
                  icon: (
                    <Icons.heartHandshake className="w-8 h-8 text-red-500 dark:text-red-400" />
                  ),
                  title: 'Integrity',
                  description:
                    'We operate with transparency, honesty, and a strong ethical compass in all our interactions.',
                  bgColor: 'bg-red-100 dark:bg-red-900/30',
                },
                {
                  icon: (
                    <Icons.ai className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                  ),
                  title: 'Empowerment',
                  description:
                    'We aim to equip individuals with skills and knowledge that empower them to achieve their goals.',
                  bgColor: 'bg-teal-100 dark:bg-teal-900/30',
                },
              ].map((value, index) => (
                <motion.div key={index} custom={index} variants={itemVariants}>
                  <Card className="h-full text-center p-6 md:p-8 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl dark:hover:shadow-slate-700/60 transition-all duration-300 transform hover:-translate-y-1.5 border dark:border-slate-700">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${value.bgColor}`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Our Leadership Team */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-16 md:mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-slate-800 dark:text-slate-100 text-center"
            >
              Meet Our Leadership
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {leadershipTeam.map((member, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  <Avatar className="w-32 h-32 md:w-36 md:h-36 mb-4 shadow-lg border-4 border-transparent group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-3xl bg-slate-200 dark:bg-slate-700">
                      {member.name.substring(0, 1) +
                        (member.name.split(' ')[1]?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {member.title}
                  </p>
                  <p className="text-xs text-muted-foreground px-2">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16 md:mb-20 bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 rounded-2xl shadow-xl"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-10 text-slate-800 dark:text-slate-100 text-center"
            >
              3TEduTech by the Numbers
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  className="text-center p-4 bg-background dark:bg-slate-800 rounded-lg shadow-md"
                >
                  <div className={`mb-3 ${stat.color}`}>
                    {React.cloneElement(stat.icon, {
                      className: 'w-10 h-10 md:w-12 md:h-12 mx-auto',
                    })}
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-extrabold ${stat.color} mb-1`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Final CTA */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center py-10 md:py-16 border-t dark:border-slate-700"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6"
            >
              Ready to Transform Your Future?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              custom={0.1}
              className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Join our global learning community today. Explore thousands of
              courses, connect with experts, and unlock your potential.
            </motion.p>
            <motion.div
              variants={itemVariants}
              custom={0.2}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="default"
                asChild
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-10 py-4 text-base sm:text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/courses">
                  Explore Courses <Icons.arrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                asChild
                className="border-foreground/30 text-foreground hover:bg-foreground/5 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/60 font-semibold px-10 py-4 text-base sm:text-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/instructor/register">Become an Instructor</Link>
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
