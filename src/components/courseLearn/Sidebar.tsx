/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  ChevronDown,
  CheckCircle,
  ChevronRight,
  Clock,
  Video,
  FileText,
  Book,
  Info,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  mockCourse: any;
  activeLesson: number;
  handleLessonSelect: (lessonId: number) => void;
  setIsCourseInfoOpen: (open: boolean) => void;
  setIsChatbotOpen: (open: boolean) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  mockCourse,
  activeLesson,
  handleLessonSelect,
  setIsCourseInfoOpen,
  setIsChatbotOpen,
}) => {
  return (
    <Sidebar className="border-r bg-background w-72">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Course Content</h2>
          <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5 transform rotate-180" />
            )}
          </SidebarTrigger>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Your progress</span>
            <span>{mockCourse.progress}%</span>
          </div>
          <Progress value={mockCourse.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {mockCourse.completedLessons} of {mockCourse.totalLessons} lessons
            completed
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <ScrollArea className="h-[calc(100vh-180px)]">
          {mockCourse.sections.map((section: any) => (
            <div key={section.id} className="mb-4">
              <div className="flex items-center px-2 py-2 rounded-lg hover:bg-muted mb-1">
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center">
                    <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                    {section.title}
                  </div>
                </div>
                {section.completed ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              <div className="pl-4 space-y-1">
                {section.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center px-2 py-2 rounded-lg text-sm cursor-pointer ${
                      activeLesson === lesson.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleLessonSelect(lesson.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        {lesson.type === "VIDEO" ? (
                          <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : lesson.type === "TEXT" ? (
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : (
                          <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        <span
                          className={`${
                            activeLesson === lesson.id ? "font-medium" : ""
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center ml-6 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration}
                        {lesson.isPreview && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px] px-1 py-0 h-4"
                          >
                            Preview
                          </Badge>
                        )}
                      </div>
                    </div>
                    {lesson.completed && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCourseInfoOpen(true)}
          >
            <Info className="h-4 w-4 mr-2" />
            Course Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatbotOpen(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarComponent;
