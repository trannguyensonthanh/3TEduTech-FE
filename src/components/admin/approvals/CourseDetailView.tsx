// src/components/admin/approvals/CourseDetailView.tsx
import React, { useState } from 'react'; // Thêm useState
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Check,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CurriculumSectionAdminView from './CurriculumSectionAdminView'; // Component con để hiển thị section
import { AdminCourseView, Lesson, CourseStatusId } from '@/types/common.types'; // Import types
import { Label } from '@/components/ui/label';

interface CourseDetailViewProps {
  courseDetails: AdminCourseView; // Sử dụng type AdminCourseView đầy đủ
  // Bỏ expandedSections và toggleSectionExpand, quản lý trong component này
  onPreviewLesson: (lesson: Lesson) => void;
  onViewTextLesson: (lesson: Lesson) => void;
  onViewQuizLesson: (lesson: Lesson) => void;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  isProcessing?: boolean; // Trạng thái loading cho nút Approve/Reject
}

const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseDetails,
  onPreviewLesson,
  onViewTextLesson,
  onViewQuizLesson,
  onBack,
  onApprove,
  onReject,
  adminNotes,
  setAdminNotes,
  isProcessing = false,
}) => {
  // State quản lý section nào đang mở trong component này
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSectionExpand = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const courseUrl = `/courses/${courseDetails.slug}`; // Tạo URL preview

  return (
    <div className="space-y-6">
      {/* --- Header Buttons --- */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          ← Back to Pending List
        </Button>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
          <Button variant="default" onClick={onApprove} disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Approve
          </Button>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* --- Left Column: Course Info & Curriculum --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center gap-4">
                <CardTitle className="text-2xl">
                  {courseDetails.courseName}
                </CardTitle>
                {/* Sử dụng Link an toàn hơn nếu có router */}
                <a href={courseUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" /> Preview Course
                    Page
                  </Button>
                </a>
              </div>
              <CardDescription>
                By {courseDetails.instructorName}{' '}
                <span className="mx-1">|</span> Submitted:{' '}
                {new Date(
                  courseDetails.submittedAt || Date.now()
                ).toLocaleDateString()}
                <Badge variant="secondary" className="ml-2">
                  {courseDetails.statusId}
                </Badge>
                {courseDetails.approvalRequestId && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Request ID: {courseDetails.approvalRequestId})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Thumbnail */}
              {courseDetails.thumbnailUrl && (
                <div className="rounded-lg overflow-hidden aspect-video bg-muted">
                  <img
                    src={courseDetails.thumbnailUrl}
                    alt={courseDetails.courseName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Short Description */}
              {courseDetails.shortDescription && (
                <div>
                  <h4 className="font-semibold mb-1">Short Description</h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: courseDetails.shortDescription,
                    }}
                  ></div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t pt-4">
                <div>
                  <span className="font-medium text-muted-foreground block">
                    Category:
                  </span>{' '}
                  {courseDetails.categoryName}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">
                    Level:
                  </span>{' '}
                  {courseDetails.levelName}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">
                    Language:
                  </span>{' '}
                  {courseDetails.language}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">
                    Price:
                  </span>{' '}
                  ${courseDetails.originalPrice.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground block">
                    Discount:
                  </span>{' '}
                  {courseDetails.discountedPrice
                    ? `$${courseDetails.discountedPrice.toFixed(2)}`
                    : 'None'}
                </div>
                {/* Tính toán tổng số bài học/thời lượng nếu có */}
                {/* <div><span className="font-medium text-muted-foreground block">Lessons:</span> {totalLessons}</div> */}
                {/* <div><span className="font-medium text-muted-foreground block">Duration:</span> {totalDuration}</div> */}
              </div>

              {/* Full Description */}
              {courseDetails.fullDescription && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Full Description</h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: courseDetails.fullDescription,
                    }}
                  ></div>
                </div>
              )}

              {/* Requirements */}
              {courseDetails.requirements && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: courseDetails.requirements,
                    }}
                  ></div>
                </div>
              )}

              {/* Learning Outcomes */}
              {courseDetails.learningOutcomes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">What You'll Learn</h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: courseDetails.learningOutcomes,
                    }}
                  ></div>
                </div>
              )}

              {/* Instructor Notes */}
              {courseDetails.instructorNotes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Instructor Notes</h4>
                  <p className="text-sm p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md">
                    {courseDetails.instructorNotes}
                  </p>
                </div>
              )}

              {/* Curriculum */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">
                  Curriculum Review
                </h4>
                <div className="border rounded-md divide-y">
                  {courseDetails.sections &&
                  courseDetails.sections.length > 0 ? (
                    courseDetails.sections
                      .sort((a, b) => a.sectionOrder - b.sectionOrder) // Sắp xếp section
                      .map((section) => (
                        <CurriculumSectionAdminView // Component con mới
                          key={section.sectionId}
                          section={section}
                          isExpanded={expandedSections.includes(
                            section.sectionId
                          )}
                          onToggleExpand={() =>
                            toggleSectionExpand(section.sectionId)
                          }
                          onPreviewLesson={onPreviewLesson}
                          onViewTextLesson={onViewTextLesson}
                          onViewQuizLesson={onViewQuizLesson}
                        />
                      ))
                  ) : (
                    <p className="p-4 text-center text-muted-foreground">
                      No curriculum submitted.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column: Review Decision --- */}
        <div className="lg:col-span-1 sticky top-4">
          {' '}
          {/* Sticky để ô review luôn hiển thị */}
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>
                Provide feedback and approve or reject the submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminNotes" className="font-medium">
                  Admin Notes / Feedback
                </Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Enter feedback for the instructor (required if rejecting)..."
                  className="min-h-[180px] mt-1"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  These notes will be sent to the instructor.
                </p>
              </div>
              <div className="pt-4 space-y-2 border-t">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={onApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}{' '}
                  Approve Course
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={onReject}
                  disabled={isProcessing || !adminNotes.trim()}
                  title={
                    !adminNotes.trim() ? 'Notes are required to reject' : ''
                  }
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}{' '}
                  Reject Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
