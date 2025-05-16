export interface CourseProgress {
  courseId: number;
  progress: number; // 0-100 percentage
  completedLessons: number[];
  lastAccessedLessonId: number;
  certificateId?: string;
  certificateIssueDate?: Date;
}

export interface StudentCertificate {
  id: string;
  courseId: number;
  courseTitle: string;
  studentName: string;
  instructorName: string;
  issuedDate: Date;
  completionDate: Date;
}

export interface OrderItem {
  id: number;
  courseId: number;
  courseTitle: string;
  instructorName: string;
  price: number;
  discount?: number;
  finalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  text: string;
  explanation: string;
  options: QuizOption[];
}

export interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'zip' | 'link';
  url: string;
  size?: string;
}

export interface BaseLesson {
  id: number;
  title: string;
  duration: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  completed: boolean;
  isPreview: boolean;
  description?: string;
  resources: Resource[];
  discussions: Comment[];
}

export interface VideoLesson extends BaseLesson {
  type: 'VIDEO';
  videoUrl?: string;
}

export interface TextLesson extends BaseLesson {
  type: 'TEXT';
  content: string;
}

export interface QuizLesson extends BaseLesson {
  type: 'QUIZ';
  questions: QuizQuestion[];
}

export type Lesson = VideoLesson | TextLesson | QuizLesson;

export interface Section {
  id: number;
  title: string;
  description?: string;
  lessons: Lesson[];
  isPublished?: boolean;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  coverImage: string;
  isPublished: boolean;
  sections: Section[];
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar?: string;
    isInstructor: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}
