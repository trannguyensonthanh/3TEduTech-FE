import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CourseInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    instructor: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    sections: { id: number; title: string; completed: boolean }[];
  };
}

const CourseInfoDialog: React.FC<CourseInfoDialogProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Course Information</DialogTitle>
          <DialogDescription>
            Detailed information about the course.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">Course Title</h3>
            <p>{course.title}</p>
          </div>
          <div>
            <h3 className="font-medium text-lg">Instructor</h3>
            <p>{course.instructor}</p>
          </div>
          <div>
            <h3 className="font-medium text-lg">Progress</h3>
            <p>
              {course.completedLessons} of {course.totalLessons} lessons
              completed ({course.progress}%)
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg">Sections</h3>
            <ul className="list-disc pl-5">
              {course.sections.map((section) => (
                <li key={section.id}>
                  {section.title} -{' '}
                  {section.completed ? 'Completed' : 'In Progress'}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseInfoDialog;
