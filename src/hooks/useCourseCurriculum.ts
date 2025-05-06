import { useReducer, useCallback } from 'react';
import { toast } from '@/hooks/use-toast'; // Hoặc thư viện toast của bạn

// --- Types ---
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ';

export interface QuizOption {
  tempId?: string | number; // FE temp ID
  id?: number; // DB ID
  optionText?: string;
  isCorrectAnswer?: boolean;
  optionOrder?: number; // Sẽ được tính lại
}

export interface QuizOptionOutput {
  tempId?: string | number; // FE temp ID
  OptionID?: number; // DB ID
  OptionText?: string;
  IsCorrectAnswer?: boolean;
  OptionOrder?: number; // Sẽ được tính lại
}

export interface QuizQuestion {
  tempId?: string | number; // FE temp ID
  id?: number; // DB ID
  questionText: string;
  explanation: string | null;
  questionOrder?: number; // Sẽ được tính lại
  options: QuizOption[];
}

export interface QuizQuestionOutput {
  tempId?: string | number; // FE temp ID
  QuestionID?: number; // DB ID
  QuestionText?: string;
  Explanation?: string | null;
  QuestionOrder?: number; // Sẽ được tính lại
  options: QuizOptionOutput[];
}

export interface Attachment {
  tempId?: string | number; // FE temp ID
  id?: number; // DB ID
  fileName: string;
  fileUrl?: string; // Blob URL for preview
  fileType?: string;
  fileSize?: number;
  file: File; // The actual file object for upload
}

export interface AttachmentOutput {
  tempId?: string | number; // FE temp ID
  AttachmentID?: number; // DB ID
  FileName?: string;
  FileUrl?: string; // Blob URL for preview
  FileType?: string;
  FileSize?: number;
  File?: File; // The actual file object for upload
}
export interface Subtitle {
  tempId?: string | number; // FE temp ID
  id?: number; // DB ID
  languageCode: string;
  languageName: string;
  subtitleUrl: string; // Can be Blob URL initially or final URL
  isDefault: boolean;
  // file?: File; // Nếu cần upload file .vtt
}
export interface SubtitleOutput {
  tempId?: string | number; // FE temp ID
  SubtitleID?: number; // DB ID
  LanguageCode: string;
  LanguageName: string;
  SubtitleUrl: string; // Can be Blob URL initially or final URL
  IsDefault: boolean;
  // file?: File; // Nếu cần upload file .vtt
}

export interface LessonOutput {
  id?: number | string; // ID từ BE (kiểu string như "4" hoặc số)
  tempId?: string | number; // FE temp ID
  LessonID?: number | string; // ID từ BE (kiểu string như "4" hoặc số)
  SectionID?: number | string;
  OriginalID?: number | string | null;
  CreatedAt?: string;
  UpdatedAt?: string;

  LessonName?: string;
  Description?: string | null;
  LessonOrder?: number;
  LessonType?: 'VIDEO' | 'TEXT' | 'QUIZ'; // Theo BE là chữ in hoa
  IsFreePreview?: boolean;

  // Video specific
  VideoSourceType?: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO' | null;
  ExternalVideoID?: string | null;
  LessonVideo?: File | null;
  VideoDurationSeconds?: number | null;
  ThumbnailUrl?: string | null;
  subtitles?: SubtitleOutput[];

  // Text specific
  TextContent?: string | null;

  // Quiz specific
  questions?: QuizQuestionOutput[];

  // Common
  attachments?: AttachmentOutput[];
}

export interface Lesson {
  tempId?: string | number; // FE temp ID
  id?: number | string; // DB ID (có thể là string từ backend)
  lessonName: string; // Tên bài học
  description?: string | null; // Mô tả bài học
  lessonOrder?: number; // Thứ tự bài học
  lessonType: LessonType; // Loại bài học (VIDEO, TEXT, QUIZ)
  isFreePreview: boolean; // Có phải bài học miễn phí hay không
  // Video specific
  videoSourceType?: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO' | null; // Loại nguồn video
  externalVideoInput?: string | null; // ID video từ YT/Vimeo
  lessonVideo?: File | null; // File video (nếu có upload)
  videoDurationSeconds?: number | null; // Thời lượng video
  thumbnailUrl?: string | null; // URL thumbnail của bài học
  subtitles?: Subtitle[]; // Danh sách phụ đề
  // Text specific
  textContent?: string | null; // Nội dung dạng text
  // Quiz specific
  questions?: QuizQuestion[]; // Danh sách câu hỏi
  // Common
  attachments?: Attachment[]; // Danh sách file đính kèm
  createdAt?: string; // Thời gian tạo
  updatedAt?: string; // Thời gian cập nhật
}

export interface Section {
  tempId?: string | number; // FE temp ID
  id?: number; // DB ID
  sectionName: string;
  description?: string | null;
  sectionOrder?: number; // Will be recalculated
  lessons: Lesson[];
}
export interface SectionOutput {
  tempId?: string | number; // FE temp ID
  SectionID?: number; // DB ID
  SectionName: string;
  Description?: string | null;
  SectionOrder?: number; // Will be recalculated
  lessons: LessonOutput[];
}

interface CurriculumState {
  sections: SectionOutput[];
}

// --- Actions ---
type CurriculumAction =
  | {
      type: 'ADD_SECTION';
      payload: { sectionName: string; description?: string };
    }
  | {
      type: 'UPDATE_SECTION';
      payload: {
        sectionId: number | string;
        sectionName: string;
        description?: string | null;
      };
    }
  | { type: 'DELETE_SECTION'; payload: { sectionId: number | string } }
  | {
      type: 'ADD_LESSON';
      payload: { sectionId: number | string; lesson: Lesson };
    } // Lesson đã có tempId
  | {
      type: 'UPDATE_LESSON';
      payload: { sectionId: number | string; lesson: Lesson };
    }
  | {
      type: 'DELETE_LESSON';
      payload: { sectionId: number | string; lessonId: number | string };
    }
  | { type: 'REORDER_SECTIONS'; payload: { sections: Section[] } }
  | {
      type: 'REORDER_LESSONS';
      payload: { sectionId: number | string; lessons: Lesson[] };
    }
  | { type: 'SET_CURRICULUM'; payload: { sections: Section[] } };

// --- Helper to generate unique temp IDs ---
const generateTempId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// --- Reducer ---
const curriculumReducer = (
  state: CurriculumState,
  action: CurriculumAction
): CurriculumState => {
  switch (action.type) {
    case 'ADD_SECTION': {
      const newSection: Section = {
        tempId: generateTempId('section'),
        sectionName: action.payload.sectionName,
        description: action.payload.description,
        lessons: [],
        sectionOrder: state.sections.length,
      };
      const newSectionOutput: SectionOutput = {
        tempId: newSection.tempId,
        SectionID: newSection.id as number | undefined,
        SectionName: newSection.sectionName,
        Description: newSection.description,
        SectionOrder: newSection.sectionOrder,
        lessons: newSection.lessons.map((lesson) => ({
          ...lesson,
          subtitles: lesson.subtitles?.map((subtitle) => ({
            tempId: subtitle.tempId,
            SubtitleID: subtitle.id,
            LanguageCode: subtitle.languageCode,
            LanguageName: subtitle.languageName,
            SubtitleUrl: subtitle.subtitleUrl,
            IsDefault: subtitle.isDefault,
          })) as SubtitleOutput[], // Ensure type compatibility
        })),
      };
      return { ...state, sections: [...state.sections, newSectionOutput] };
    }
    case 'UPDATE_SECTION': {
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.SectionID === action.payload.sectionId ||
          s.tempId === action.payload.sectionId
            ? {
                ...s,
                sectionName: action.payload.sectionName,
                description: action.payload.description,
              }
            : s
        ),
      };
    }
    case 'DELETE_SECTION': {
      const updatedSections = state.sections
        .filter(
          (s) =>
            s.SectionID !== action.payload.sectionId &&
            s.tempId !== action.payload.sectionId
        )
        .map((s, index) => ({ ...s, sectionOrder: index })); // Reorder
      return { ...state, sections: updatedSections };
    }
    case 'ADD_LESSON': {
      const newLesson: Lesson = {
        ...action.payload.lesson,
        tempId: action.payload.lesson.tempId || generateTempId('lesson'), // Dùng tempId nếu có hoặc tạo mới
        id: action.payload.lesson.id, // Giữ id nếu có (trường hợp edit)
        lessonOrder:
          state.sections.find(
            (s) =>
              s.SectionID === action.payload.sectionId ||
              s.tempId === action.payload.sectionId
          )?.lessons.length || 0,
      };
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.SectionID === action.payload.sectionId ||
          s.tempId === action.payload.sectionId
            ? {
                ...s,
                lessons: [
                  ...s.lessons,
                  {
                    ...newLesson,
                    subtitles: newLesson.subtitles?.map((subtitle) => ({
                      tempId: subtitle.tempId,
                      SubtitleID: subtitle.id,
                      LanguageCode: subtitle.languageCode,
                      LanguageName: subtitle.languageName,
                      SubtitleUrl: subtitle.subtitleUrl,
                      IsDefault: subtitle.isDefault,
                    })) as SubtitleOutput[], // Ensure type compatibility
                  },
                ],
              }
            : s
        ),
      };
    }
    case 'UPDATE_LESSON': {
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (
            s.SectionID === action.payload.sectionId ||
            s.tempId === action.payload.sectionId
          ) {
            return {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === action.payload.lesson.id ||
                l.tempId === action.payload.lesson.tempId
                  ? {
                      ...action.payload.lesson,
                      lessonOrder: l.LessonOrder, // Giữ order cũ khi update
                      subtitles: (action.payload.lesson.subtitles || []).map(
                        (subtitle) => ({
                          tempId: subtitle.tempId,
                          SubtitleID: subtitle.id,
                          LanguageCode: subtitle.languageCode,
                          LanguageName: subtitle.languageName,
                          SubtitleUrl: subtitle.subtitleUrl,
                          IsDefault: subtitle.isDefault,
                        })
                      ) as SubtitleOutput[], // Chuyển đổi sang SubtitleOutput
                    }
                  : l
              ),
            };
          }
          return s;
        }),
      };
    }
    case 'DELETE_LESSON': {
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (
            s.SectionID === action.payload.sectionId ||
            s.tempId === action.payload.sectionId
          ) {
            const updatedLessons = s.lessons
              .filter(
                (l) =>
                  l.id !== action.payload.lessonId &&
                  l.tempId !== action.payload.lessonId
              )
              .map((l, index) => ({ ...l, lessonOrder: index })); // Reorder
            return { ...s, lessons: updatedLessons };
          }
          return s;
        }),
      };
    }
    case 'REORDER_SECTIONS': {
      const reorderedSections = action.payload.sections.map(
        (section, index) => ({
          ...section,
          SectionOrder: index,
          SectionName: section.sectionName,
          Description: section.description,
          lessons: section.lessons.map((lesson) => ({
            ...lesson,
            subtitles: lesson.subtitles?.map((subtitle) => ({
              tempId: subtitle.tempId,
              SubtitleID: subtitle.id,
              LanguageCode: subtitle.languageCode,
              LanguageName: subtitle.languageName,
              SubtitleUrl: subtitle.subtitleUrl,
              IsDefault: subtitle.isDefault,
            })) as SubtitleOutput[],
          })) as LessonOutput[],
        })
      );
      return { ...state, sections: reorderedSections };
    }
    case 'REORDER_LESSONS': {
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (
            s.SectionID === action.payload.sectionId ||
            s.tempId === action.payload.sectionId
          ) {
            const reorderedLessons = action.payload.lessons.map(
              (lesson, index) => ({
                ...lesson,
                lessonOrder: index,
                subtitles: (lesson.subtitles || []).map((subtitle) => ({
                  tempId: subtitle.tempId,
                  SubtitleID: subtitle.id,
                  LanguageCode: subtitle.languageCode,
                  LanguageName: subtitle.languageName,
                  SubtitleUrl: subtitle.subtitleUrl,
                  IsDefault: subtitle.isDefault,
                })) as SubtitleOutput[], // Chuyển đổi sang SubtitleOutput
              })
            );
            return { ...s, lessons: reorderedLessons as LessonOutput[] }; // Đảm bảo kiểu LessonOutput[]
          }
          return s;
        }),
      };
    }
    case 'SET_CURRICULUM': {
      const initialSections = action.payload.sections.map((s) => ({
        ...s,
        tempId: s.tempId || s.id || generateTempId('section'),
        SectionName: s.sectionName || '',
        Description: s.description || null,
        SectionOrder: s.sectionOrder || 0,
        lessons: (s.lessons || []).map((l) => ({
          ...l,
          tempId: l.tempId || l.id || generateTempId('lesson'),
          LessonName: l.lessonName || '',
          Description: l.description || null,
          LessonOrder: l.lessonOrder || 0,
          questions: (l.questions || []).map((q) => ({
            ...q,
            tempId: q.tempId || q.id || generateTempId('question'),
            QuestionText: q.questionText || '',
            Explanation: q.explanation || null,
            QuestionOrder: q.questionOrder || 0,
            options: (q.options || []).map((o) => ({
              ...o,
              tempId: o.tempId || o.id || generateTempId('option'),
              OptionText: o.optionText || '',
              IsCorrectAnswer: o.isCorrectAnswer || false,
              OptionOrder: o.optionOrder || 0,
            })),
          })),
          attachments: (l.attachments || []).map((a) => ({
            ...a,
            tempId: a.tempId || a.id || generateTempId('attach'),
            file: a.file || null,
          })),
          subtitles: (l.subtitles || []).map((sub) => ({
            tempId: sub.tempId || sub.id || generateTempId('sub'),
            SubtitleID: sub.id,
            LanguageCode: sub.languageCode,
            LanguageName: sub.languageName,
            SubtitleUrl: sub.subtitleUrl,
            IsDefault: sub.isDefault,
          })),
        })),
      }));
      return { sections: initialSections };
    }
    default:
      throw new Error(`Unhandled action type: ${action}`); // Hoặc return state
  }
};

// --- Custom Hook ---
export const useCourseCurriculum = (
  initialState: CurriculumState = { sections: [] }
) => {
  const [state, dispatch] = useReducer(curriculumReducer, initialState);

  // --- Callbacks ---
  const addSection = useCallback(
    (sectionName: string, description?: string) => {
      dispatch({ type: 'ADD_SECTION', payload: { sectionName, description } });
      toast({
        title: 'Section added',
        description: `Section "${sectionName}" created.`,
      });
    },
    []
  );

  const updateSection = useCallback(
    (
      sectionId: number | string,
      sectionName: string,
      description?: string | null
    ) => {
      dispatch({
        type: 'UPDATE_SECTION',
        payload: { sectionId, sectionName, description },
      });
      toast({
        title: 'Section updated',
        description: `Section "${sectionName}" updated.`,
      });
    },
    []
  );

  const deleteSectionCallback = useCallback((sectionId: number | string) => {
    // Renamed to avoid conflict
    // TODO: Add confirmation dialog logic here before dispatching
    dispatch({ type: 'DELETE_SECTION', payload: { sectionId } });
    toast({ title: 'Section deleted', variant: 'destructive' });
  }, []);

  const addLesson = useCallback(
    (
      sectionId: number | string,
      lesson: Omit<Lesson, 'id' | 'tempId' | 'lessonOrder'>
    ) => {
      // Add a temporary ID before dispatching
      const lessonWithTempId = { ...lesson, tempId: generateTempId('lesson') };
      dispatch({
        type: 'ADD_LESSON',
        payload: { sectionId, lesson: lessonWithTempId },
      });
      toast({
        title: 'Lesson added',
        description: `Lesson "${lesson.lessonName}" added.`,
      });
    },
    []
  );

  const updateLesson = useCallback(
    (sectionId: number | string, lesson: Lesson) => {
      // Ensure the lesson has a tempId or id before dispatching
      const lessonToUpdate = { ...lesson, tempId: lesson.tempId || lesson.id };
      if (!lessonToUpdate.tempId && !lessonToUpdate.id) {
        console.error('Cannot update lesson without id or tempId', lesson);
        toast({
          title: 'Error',
          description: 'Cannot update lesson.',
          variant: 'destructive',
        });
        return;
      }
      dispatch({
        type: 'UPDATE_LESSON',
        payload: { sectionId, lesson: lessonToUpdate },
      });
      toast({
        title: 'Lesson updated',
        description: `Lesson "${lesson.lessonName}" updated.`,
      });
    },
    []
  );

  const deleteLessonCallback = useCallback(
    (sectionId: number | string, lessonId: number | string) => {
      // Renamed
      // TODO: Add confirmation dialog logic here
      dispatch({ type: 'DELETE_LESSON', payload: { sectionId, lessonId } });
      toast({ title: 'Lesson deleted', variant: 'destructive' });
    },
    []
  );

  const reorderSections = useCallback((sections: Section[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: { sections } });
  }, []);

  const reorderLessons = useCallback(
    (sectionId: number | string, lessons: Lesson[]) => {
      dispatch({ type: 'REORDER_LESSONS', payload: { sectionId, lessons } });
    },
    []
  );

  const setCurriculum = useCallback((sections: Section[]) => {
    dispatch({ type: 'SET_CURRICULUM', payload: { sections } });
  }, []);

  return {
    sections: state.sections,
    addSection,
    updateSection,
    deleteSection: deleteSectionCallback, // Export renamed function
    addLesson,
    updateLesson,
    deleteLesson: deleteLessonCallback, // Export renamed function
    reorderSections,
    reorderLessons,
    setCurriculum,
  };
};
