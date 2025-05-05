import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Lesson, QuizLesson, TextLesson, VideoLesson } from "@/types/course";

interface LessonContentProps {
  lesson: Lesson;
  selectedAnswers: { [key: number]: number };
  quizSubmitted: boolean;
  onQuizOptionSelect: (questionId: number, optionId: number) => void;
  onQuizSubmit: () => void;
  isQuizOptionCorrect: (
    questionId: number,
    optionId: number
  ) => boolean | undefined;
  calculateQuizScore: () => number;
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  selectedAnswers,
  quizSubmitted,
  onQuizOptionSelect,
  onQuizSubmit,
  isQuizOptionCorrect,
  calculateQuizScore,
}) => {
  if (lesson.type === "VIDEO") {
    const videoLesson = lesson as VideoLesson;
    return (
      <div className="bg-black rounded-lg overflow-hidden aspect-video">
        <iframe
          className="w-full h-full"
          src={videoLesson.videoUrl}
          title={videoLesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (lesson.type === "TEXT") {
    const textLesson = lesson as TextLesson;
    return (
      <div className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: textLesson.content,
          }}
        ></div>
      </div>
    );
  }

  if (lesson.type === "QUIZ") {
    const quizLesson = lesson as QuizLesson;
    return (
      <div className="space-y-6">
        {quizLesson.questions.map((question, qIndex) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-3">
            <h3 className="text-lg font-medium">
              {qIndex + 1}. {question.text}
            </h3>
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = selectedAnswers[question.id] === option.id;
                const isCorrect = isQuizOptionCorrect(question.id, option.id);

                let optionClass =
                  "border rounded-md p-3 cursor-pointer transition-colors";

                if (quizSubmitted) {
                  if (option.isCorrect) {
                    optionClass += " bg-green-50 border-green-200";
                  } else if (isSelected && !option.isCorrect) {
                    optionClass += " bg-red-50 border-red-200";
                  }
                } else if (isSelected) {
                  optionClass += " border-primary bg-primary/5";
                } else {
                  optionClass += " hover:border-muted-foreground";
                }

                return (
                  <div
                    key={option.id}
                    className={optionClass}
                    onClick={() => onQuizOptionSelect(question.id, option.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">{option.text}</div>
                      {quizSubmitted && option.isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {quizSubmitted && question.explanation && (
              <div className="bg-muted p-3 rounded-md text-sm mt-3">
                <p className="font-medium mb-1">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}

        {quizSubmitted ? (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Quiz Results</h3>
            <p>Your score: {calculateQuizScore()}%</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <Button onClick={onQuizSubmit}>Submit Answers</Button>
        )}
      </div>
    );
  }

  return null;
};

export default LessonContent;
