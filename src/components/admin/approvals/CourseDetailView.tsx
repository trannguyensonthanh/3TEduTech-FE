/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Check, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CurriculumSection from './CurriculumSection';

interface CourseDetailViewProps {
  courseDetails: any;
  expandedSections: number[];
  toggleSectionExpand: (sectionId: number) => void;
  onPreviewLesson: (lesson: any) => void;
  onViewTextLesson: (lesson: any) => void;
  onViewQuizLesson: (lesson: any) => void;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseDetails,
  expandedSections,
  toggleSectionExpand,
  onPreviewLesson,
  onViewTextLesson,
  onViewQuizLesson,
  onBack,
  onApprove,
  onReject,
  adminNotes,
  setAdminNotes,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="text-destructive"
            onClick={onReject}
          >
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button variant="default" onClick={onApprove}>
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Course Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/courses/${courseDetails.slug}`, '_blank')
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Preview Course
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden mb-4">
              <img
                src={courseDetails.thumbnailUrl}
                alt={courseDetails.courseName}
                className="w-full h-auto object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold">{courseDetails.courseName}</h3>
              <p className="text-muted-foreground">
                By {courseDetails.instructorName}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Category
                </h4>
                <p>{courseDetails.categoryName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Price
                </h4>
                <p>${courseDetails.price.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Lessons
                </h4>
                <p>{courseDetails.lessons}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Duration
                </h4>
                <p>{courseDetails.totalDuration}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Request Type
              </h4>
              <Badge>
                {courseDetails.type === 'NEW_COURSE'
                  ? 'New Course'
                  : 'Course Update'}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Instructor Notes
              </h4>
              <p className="p-3 bg-muted rounded-md">
                {courseDetails.notes || 'No notes provided by instructor.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Curriculum Overview
              </h4>
              <div className="border rounded-md divide-y">
                {courseDetails.curriculum.map((section) => (
                  <CurriculumSection
                    key={section.id}
                    section={section}
                    expandedSections={expandedSections}
                    toggleSectionExpand={toggleSectionExpand}
                    onPreviewLesson={onPreviewLesson}
                    onViewTextLesson={onViewTextLesson}
                    onViewQuizLesson={onViewQuizLesson}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Admin Notes</h4>
              <Textarea
                placeholder="Enter your review notes here..."
                className="min-h-[150px]"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                These notes will be visible to the instructor.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="default" className="w-full" onClick={onApprove}>
                <Check className="mr-2 h-4 w-4" /> Approve Course
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive"
                onClick={onReject}
              >
                <X className="mr-2 h-4 w-4" /> Reject Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetailView;
