/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Book,
  Clock,
  Edit,
  FileText,
  Layers,
  Plus,
  Trash,
  Video,
} from 'lucide-react';

interface CurriculumTabProps {
  sections: any[];
  handleAddSection: () => void;
  handleEditSection: (sectionId: number) => void;
  handleAddLesson: (sectionId: number) => void;
  handleEditLesson: (sectionId: number, lessonId: number) => void;
  handleDeleteLesson: (sectionId: number, lessonId: number) => void;
}

const CurriculumTab: React.FC<CurriculumTabProps> = ({
  sections,
  handleAddSection,
  handleEditSection,
  handleAddLesson,
  handleEditLesson,
  handleDeleteLesson,
}) => {
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
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {section.sectionName}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(section.id)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-md border p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      {lesson.lessonType === 'VIDEO' && (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                      {lesson.lessonType === 'TEXT' && (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      )}
                      {lesson.lessonType === 'QUIZ' && (
                        <Book className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{lesson.lessonName}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />{' '}
                          {lesson.videoDurationSeconds} • {lesson.lessonType}
                          {lesson.isFreePreview && ' • Preview'}
                          {lesson.attachments.length > 0 &&
                            ` • ${lesson.attachments.length} attachment(s)`}
                          {lesson.type === 'QUIZ' &&
                            lesson.questions &&
                            ` • ${lesson.questions.length} question(s)`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLesson(section.id, lesson.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteLesson(section.id, lesson.id)
                        }
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => handleAddLesson(section.id)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button className="w-full" onClick={handleAddSection}>
          <Plus className="h-4 w-4 mr-2" /> Add New Section
        </Button>
      </div>
    </div>
  );
};

export default CurriculumTab;
