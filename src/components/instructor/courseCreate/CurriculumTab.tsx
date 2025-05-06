// src/components/instructor/courseCreate/CurriculumTab.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Layers,
  Edit,
  Plus,
  Trash,
  Video,
  FileText,
  Book,
  Clock,
  File as FileIcon,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import {
  Section,
  Lesson,
  SectionOutput,
  LessonOutput,
} from '@/hooks/useCourseCurriculum'; // Import types

interface CurriculumTabProps {
  sections: SectionOutput[]; // Nhận từ hook useCourseCurriculum
  handleAddSection: () => void; // Callback mở dialog add section
  handleEditSection: (section: SectionOutput) => void; // Callback mở dialog edit section
  handleDeleteSection: (sectionId: number | string) => void; // Callback xóa section
  handleAddLesson: (sectionId: number | string) => void; // Callback mở dialog add lesson
  handleEditLesson: (sectionId: number | string, lesson: LessonOutput) => void; // Callback mở dialog edit lesson
  handleDeleteLesson: (
    sectionId: number | string,
    lessonId: number | string
  ) => void; // Callback xóa lesson
  // Thêm props cho kéo thả nếu cần
}

const CurriculumTab: React.FC<CurriculumTabProps> = ({
  sections,
  handleAddSection,
  handleEditSection,
  handleDeleteSection, // Thêm prop này
  handleAddLesson,
  handleEditLesson,
  handleDeleteLesson,
}) => {
  // --- Helper định dạng thời gian (có thể đưa ra util) ---
  const formatDuration = (seconds?: number | null): string => {
    if (seconds === null || seconds === undefined || seconds <= 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="space-y-4">
      {/* Curriculum Tips */}
      <div className="bg-muted/50 rounded-md p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium mb-1">Build Your Course Content</h3>
            <p className="text-sm text-muted-foreground">
              Organize your course into sections and lessons. A well-structured
              curriculum helps students navigate your course efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Sections and Lessons */}
      <div className="space-y-4">
        {sections?.map(
          (
            section,
            sectionIndex // Thêm sectionIndex
          ) => (
            <Card key={section.tempId || section.SectionID}>
              <CardHeader className="pb-3 flex flex-row justify-between items-center">
                {' '}
                {/* Dùng flex */}
                <div className="flex items-center space-x-3">
                  <Layers className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <CardTitle className="text-lg">
                    {/* Có thể thêm thứ tự section */}
                    {`Section ${sectionIndex + 1}: ${section.sectionName}`}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  {' '}
                  {/* Group nút */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection(section)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleDeleteSection(section.tempId || section.SectionID!)
                    }
                  >
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pl-6 pr-4">
                {' '}
                {/* Thêm padding */}
                {/* Mô tả section nếu có */}
                {section.Description && (
                  <p className="text-sm text-muted-foreground mb-3 pl-8">
                    {section.Description}
                  </p>
                )}
                <div className="space-y-3 border-l-2 pl-6 ml-2 border-dashed">
                  {' '}
                  {/* Thụt lề và đường kẻ cho lessons */}
                  {section.lessons?.map(
                    (
                      lesson,
                      lessonIndex // Thêm lessonIndex
                    ) => (
                      <div
                        key={lesson.tempId || lesson.id}
                        className="rounded-md border p-3 flex justify-between items-center hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Icon based on type */}
                          {lesson.LessonType === 'VIDEO' && (
                            <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          )}
                          {lesson.LessonType === 'TEXT' && (
                            <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          {lesson.LessonType === 'QUIZ' && (
                            <BookOpen className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          )}{' '}
                          {/* Đổi icon */}
                          <div>
                            <p className="font-medium">{`Lesson ${
                              lessonIndex + 1
                            }: ${lesson.LessonName}`}</p>
                            <p className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1">
                              {' '}
                              {/* flex-wrap cho mobile */}
                              {lesson.LessonType === 'VIDEO' &&
                                lesson.VideoDurationSeconds && (
                                  <>
                                    <Clock className="h-3 w-3" />{' '}
                                    {formatDuration(
                                      lesson.VideoDurationSeconds
                                    )}
                                  </>
                                )}
                              <span>• {lesson.LessonType}</span>
                              {lesson.IsFreePreview && (
                                <span className="text-green-600">
                                  • Preview
                                </span>
                              )}
                              {lesson.attachments &&
                                lesson.attachments.length > 0 && (
                                  <span className="flex items-center">
                                    <FileIcon className="h-3 w-3 mr-1" />{' '}
                                    {lesson.attachments.length} Attachment(s)
                                  </span>
                                )}
                              {lesson.LessonType === 'QUIZ' &&
                                lesson.questions &&
                                lesson.questions.length > 0 && (
                                  <span className="flex items-center">
                                    <Book className="h-3 w-3 mr-1" />{' '}
                                    {lesson.questions.length} Question(s)
                                  </span>
                                )}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleEditLesson(
                                section.tempId || section.SectionID!,
                                lesson
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleDeleteLesson(
                                section.tempId || section.SectionID!,
                                lesson.tempId || lesson.id!
                              )
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                  {/* Nút Add Lesson */}
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    size="sm"
                    onClick={() =>
                      handleAddLesson(section.tempId || section.SectionID!)
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Lesson to "
                    {section.SectionName}"
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}

        <Button type="button" className="w-full" onClick={handleAddSection}>
          <Plus className="h-4 w-4 mr-2" /> Add New Section
        </Button>
      </div>
    </div>
  );
};

export default CurriculumTab;
