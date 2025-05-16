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
  BookIcon,
} from 'lucide-react';

import { Lesson } from '@/types/common.types';
import { Section } from '@/services/section.service';

// Import thư viện kéo thả (ví dụ: react-beautiful-dnd)
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; // Hoặc thư viện khác
// import { useUpdateSectionsOrder, useUpdateLessonsOrder } from '@/hooks/queries/course.queries'; // Hook sắp xếp
interface CurriculumTabProps {
  courseId: number; // ** Cần Course ID để gọi API sắp xếp **
  sections: Section[];
  handleAddSection: () => void;
  handleEditSection: (section: Section) => void;
  handleDeleteSection: (sectionId: number | string) => void; // Callback này sẽ mở dialog xác nhận ở component cha
  handleAddLesson: (sectionId: number | string) => void;
  handleEditLesson: (sectionId: number | string, lesson: Lesson) => void;
  handleDeleteLesson: (
    sectionId: number | string,
    lessonId: number | string
  ) => void; // Callback này sẽ mở dialog xác nhận
  // Hàm callback cho việc sắp xếp (nếu dùng kéo thả)
  // onReorderSections: (orderedSections: { id: number; order: number }[]) => void;
  // onReorderLessons: (sectionId: number | string, orderedLessons: { id: number; order: number }[]) => void;
}
const CurriculumTab: React.FC<CurriculumTabProps> = ({
  courseId, // Nhận courseId
  sections = [], // Mặc định là mảng rỗng
  handleAddSection,
  handleEditSection,
  handleDeleteSection,
  handleAddLesson,
  handleEditLesson,
  handleDeleteLesson,
  // onReorderSections,
  // onReorderLessons,
}) => {
  // --- State cho kéo thả (Nếu dùng react-beautiful-dnd) ---
  // const [localSections, setLocalSections] = useState(sections);
  // useEffect(() => { setLocalSections(sections) }, [sections]); // Cập nhật state local khi props thay đổi

  // --- Hook Mutation cho Sắp xếp (Nếu dùng kéo thả) ---
  // const { mutate: reorderSectionsMutate, isPending: isReorderingSections } = useUpdateSectionsOrder();
  // const { mutate: reorderLessonsMutate, isPending: isReorderingLessons } = useUpdateLessonsOrder();

  // --- Hàm xử lý kết quả kéo thả ---

  // const onDragEnd = (result: DropResult) => {
  //   const { source, destination, type } = result;

  //   // Không làm gì nếu kéo ra ngoài hoặc không thay đổi vị trí
  //   if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
  //     return;
  //   }

  //   if (type === 'SECTION') {
  //     const reordered = Array.from(localSections);
  //     const [removed] = reordered.splice(source.index, 1);
  //     reordered.splice(destination.index, 0, removed);

  //     // Cập nhật state local ngay lập tức để UI mượt
  //     setLocalSections(reordered);

  //     // Chuẩn bị payload cho API
  //     const orderedSectionsPayload = reordered.map((section, index) => ({
  //       id: Number(section.sectionId), // Đảm bảo là number nếu API yêu cầu
  //       order: index,
  //     }));

  //     // Gọi API reorder sections
  //     // onReorderSections(orderedSectionsPayload); // Gọi callback truyền lên cha
  //     reorderSectionsMutate({ courseId, orderedSections: orderedSectionsPayload }, {
  //        onSuccess: () => {/* toast success */},
  //        onError: (err) => {/* toast error, có thể reset lại localSections về props.sections */},
  //     });

  //   } else if (type === 'LESSON' && source.droppableId === destination.droppableId) {
  //     // Chỉ cho phép kéo thả lesson trong cùng một section
  //     const sectionIdStr = source.droppableId.replace('lessons-', '');
  //     const sectionIndex = localSections.findIndex(s => String(s.sectionId || s.tempId) === sectionIdStr);

  //     if (sectionIndex === -1) return;

  //     const newLessons = Array.from(localSections[sectionIndex].lessons);
  //     const [removed] = newLessons.splice(source.index, 1);
  //     newLessons.splice(destination.index, 0, removed);

  //     // Cập nhật state local
  //     const newSections = [...localSections];
  //     newSections[sectionIndex] = { ...newSections[sectionIndex], lessons: newLessons };
  //     setLocalSections(newSections);

  //     // Chuẩn bị payload cho API
  //     const sectionIdNum = Number(localSections[sectionIndex].sectionId); // Lấy ID thật
  //     if (!sectionIdNum) return; // Không gọi API nếu section chưa có ID thật

  //     const orderedLessonsPayload = newLessons.map((lesson, index) => ({
  //       id: Number(lesson.id), // Đảm bảo là number
  //       order: index,
  //     }));

  //     // Gọi API reorder lessons
  //     // onReorderLessons(sectionIdNum, orderedLessonsPayload);
  //      reorderLessonsMutate({ sectionId: sectionIdNum, orderedLessons: orderedLessonsPayload }, {
  //          onSuccess: () => {/* toast success */},
  //          onError: (err) => {/* toast error, reset lại state */},
  //      });
  //   }
  // };

  // --- Helper định dạng thời gian ---
  const formatDuration = (seconds?: number | null): string => {
    if (seconds === null || seconds === undefined || seconds <= 0) return '-'; // Trả về '-' thay vì 'N/A'
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60); // Làm tròn giây
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let durationString = '';
    if (hours > 0) {
      durationString += `${hours}h `;
    }
    if (remainingMinutes > 0 || hours > 0) {
      // Luôn hiển thị phút nếu có giờ
      durationString += `${remainingMinutes}m `;
    }
    // Chỉ hiển thị giây nếu tổng thời gian < 1 giờ
    if (hours === 0 && totalMinutes < 60) {
      durationString += `${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}s`;
    }
    return durationString.trim();
  };
  return (
    <div className="space-y-4">
      {/* Curriculum Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
              Build Your Course Content
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300/90">
              Start structuring your course by adding sections, then fill each
              section with lessons (videos, text, quizzes) and optional
              attachments or subtitles. You can easily reorder items using drag
              and drop (if enabled).
            </p>
          </div>
        </div>
      </div>

      {/* Sections and Lessons List */}
      {/* <DragDropContext onDragEnd={onDragEnd}> */}
      {/* <Droppable droppableId="all-sections" type="SECTION"> */}
      {/* {(provided) => ( */}
      {/* <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4"> */}
      {sections?.length > 0 ? (
        sections.map((section, sectionIndex) => (
          // <Draggable key={String(section.tempId || section.sectionId)} draggableId={String(section.tempId || section.sectionId)} index={sectionIndex}>
          // {(providedDraggable) => (
          <Card
            key={section.tempId || section.sectionId} // Key cho React list rendering
            // ref={providedDraggable.innerRef}
            // {...providedDraggable.draggableProps}
            className="overflow-hidden" // Tránh overflow khi kéo
          >
            <CardHeader className="bg-muted/50 dark:bg-muted/30 p-3 flex flex-row justify-between items-center border-b">
              <div className="flex items-center space-x-2 flex-grow min-w-0">
                {/* <div {...providedDraggable.dragHandleProps} className="cursor-grab p-1">
                             <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div> */}
                <Layers className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <CardTitle
                  className="text-lg truncate flex-grow"
                  title={section.sectionName}
                >
                  {`Section ${sectionIndex + 1}: ${
                    section.sectionName || 'Untitled Section'
                  }`}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(section)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    handleDeleteSection(section.tempId || section.sectionId!)
                  }
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {section.description && (
                <p className="text-sm text-muted-foreground px-4 py-2 border-b bg-background">
                  {section.description}
                </p>
              )}
              {/* <Droppable droppableId={`lessons-${String(section.tempId || section.sectionId)}`} type="LESSON"> */}
              {/* {(providedLessons) => ( */}
              {/* <div ref={providedLessons.innerRef} {...providedLessons.droppableProps} className="divide-y"> */}
              {(section.lessons?.length ?? 0) > 0 ? (
                section.lessons.map((lesson, lessonIndex) => (
                  // <Draggable key={String(lesson.tempId || lesson.id)} draggableId={String(lesson.tempId || lesson.id)} index={lessonIndex}>
                  // {(providedLessonDraggable) => (
                  <div
                    key={lesson.tempId || lesson.lessonId} // Key cho React list rendering
                    // ref={providedLessonDraggable.innerRef}
                    // {...providedLessonDraggable.draggableProps}
                    className="p-3 flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-grow min-w-0">
                      {/* <div {...providedLessonDraggable.dragHandleProps} className="cursor-grab p-1 -ml-1">
                                            <GripVertical className="h-5 w-5 text-muted-foreground/50" />
                                          </div> */}
                      {/* Icon */}
                      {lesson.lessonType === 'VIDEO' && (
                        <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                      {lesson.lessonType === 'TEXT' && (
                        <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {lesson.lessonType === 'QUIZ' && (
                        <BookIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      )}
                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <p
                          className="font-medium truncate"
                          title={lesson.lessonName}
                        >{`Lesson ${lessonIndex + 1}: ${
                          lesson.lessonName || 'Untitled Lesson'
                        }`}</p>
                        <p className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1">
                          {lesson.lessonType === 'VIDEO' && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-0.5" />{' '}
                              {formatDuration(lesson.videoDurationSeconds)}
                            </span>
                          )}
                          <span>• {lesson.lessonType}</span>
                          {lesson.isFreePreview && (
                            <span className="text-green-600 font-semibold">
                              • Preview
                            </span>
                          )}
                          {(lesson.attachments?.length ?? 0) > 0 && (
                            <span className="flex items-center">
                              <FileIcon className="h-3 w-3 mr-0.5" />{' '}
                              {lesson.attachments?.length} File(s)
                            </span>
                          )}
                          {(lesson.questions?.length ?? 0) > 0 && (
                            <span className="flex items-center">
                              <BookIcon className="h-3 w-3 mr-0.5" />{' '}
                              {lesson.questions?.length} Qs
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          handleEditLesson(
                            section.tempId || section.sectionId!,
                            lesson
                          )
                        }
                      >
                        {' '}
                        <Edit className="h-4 w-4" />{' '}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          handleDeleteLesson(
                            section.tempId || section.sectionId!,
                            lesson.tempId || lesson.lessonId!
                          )
                        }
                      >
                        {' '}
                        <Trash className="h-4 w-4" />{' '}
                      </Button>
                    </div>
                  </div>
                  // )}
                  // </Draggable>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 px-3">
                  No lessons in this section yet.
                </p>
              )}
              {/* {providedLessons.placeholder} */}
              {/* </div> */}
              {/* )} */}
              {/* </Droppable> */}
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  size="sm"
                  onClick={() =>
                    handleAddLesson(section.tempId || section.sectionId!)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Lesson to "
                  {section.sectionName}"
                </Button>
              </div>
            </CardContent>
          </Card>
          // )}
          // </Draggable>
        ))
      ) : (
        <div className="text-center py-10 border border-dashed rounded-md">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">Your curriculum is empty</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start by adding your first section.
          </p>
        </div>
      )}
      {/* {provided.placeholder} */}
      {/* </div> */}
      {/* )} */}
      {/* </Droppable> */}
      {/* </DragDropContext> */}

      <Button type="button" className="w-full mt-4" onClick={handleAddSection}>
        <Plus className="h-4 w-4 mr-2" /> Add New Section
      </Button>
    </div>
  );
};

export default CurriculumTab;
