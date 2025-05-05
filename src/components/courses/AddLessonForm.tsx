import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddLessonFormProps {
  sectionId: number;
  onAddLesson: (
    sectionId: number,
    lessonTitle: string,
    lessonDescription: string,
    lessonType: "VIDEO" | "TEXT" | "QUIZ"
  ) => void;
  onCancel: () => void;
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({
  sectionId,
  onAddLesson,
  onCancel,
}) => {
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDescription, setNewLessonDescription] = useState("");
  const [newLessonType, setNewLessonType] = useState<"VIDEO" | "TEXT" | "QUIZ">(
    "VIDEO"
  );

  const handleSubmit = () => {
    if (!newLessonTitle.trim()) return;
    onAddLesson(sectionId, newLessonTitle, newLessonDescription, newLessonType);
    resetForm();
  };

  const resetForm = () => {
    setNewLessonTitle("");
    setNewLessonDescription("");
    setNewLessonType("VIDEO");
    onCancel();
  };

  return (
    <div className="p-4 bg-muted/30">
      <h4 className="font-medium mb-3">Add New Lesson</h4>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`new-lesson-title-${sectionId}`}>Lesson Title</Label>
          <Input
            id={`new-lesson-title-${sectionId}`}
            placeholder="Enter lesson title"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`new-lesson-description-${sectionId}`}>
            Description (optional)
          </Label>
          <Textarea
            id={`new-lesson-description-${sectionId}`}
            placeholder="Enter lesson description"
            value={newLessonDescription}
            onChange={(e) => setNewLessonDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor={`new-lesson-type-${sectionId}`}>Lesson Type</Label>
          <Select
            value={newLessonType}
            onValueChange={(value: "VIDEO" | "TEXT" | "QUIZ") =>
              setNewLessonType(value)
            }
          >
            <SelectTrigger id={`new-lesson-type-${sectionId}`}>
              <SelectValue placeholder="Select lesson type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="TEXT">Text</SelectItem>
              <SelectItem value="QUIZ">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Lesson</Button>
        </div>
      </div>
    </div>
  );
};

export default AddLessonForm;
