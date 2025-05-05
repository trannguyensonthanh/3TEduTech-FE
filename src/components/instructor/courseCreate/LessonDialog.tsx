/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Video,
  FileText,
  Book,
  Upload,
  Trash,
  Edit,
  Plus,
  File,
  X,
} from 'lucide-react';

interface LessonDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  lessonData: any;
  setLessonData: (data: any) => void;
  handleLessonVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAttachment: (attachmentId: number) => void;
  handleAddQuestion: () => void;
  handleEditQuestion: (questionId: number) => void;
  handleDeleteQuestion: (questionId: number) => void;
  lessonVideoRef: React.RefObject<HTMLInputElement>;
  attachmentRef: React.RefObject<HTMLInputElement>;
  editingLessonId: number | null;
  handleVideoSourceTypeChange: (
    value: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO'
  ) => void;
}

const LessonDialog: React.FC<LessonDialogProps> = ({
  open,
  onClose,
  onSave,
  lessonData,
  setLessonData,
  handleLessonVideoChange,
  handleAttachmentUpload,
  handleRemoveAttachment,
  handleAddQuestion,
  handleEditQuestion,
  handleDeleteQuestion,
  lessonVideoRef,
  attachmentRef,
  editingLessonId,
  handleVideoSourceTypeChange,
}) => {
  const [newSubtitle, setNewSubtitle] = useState({
    languageCode: '',
    languageName: '',
    subtitleUrl: '',
    isDefault: false,
  });

  const handleAddSubtitle = () => {
    if (!newSubtitle.languageCode || !newSubtitle.subtitleUrl) return;

    setLessonData((prevLessonData) => ({
      ...prevLessonData,
      subtitles: [
        ...(prevLessonData.subtitles || []),
        { ...newSubtitle, id: Date.now() },
      ],
    }));

    setNewSubtitle({
      languageCode: '',
      languageName: '',
      subtitleUrl: '',
      isDefault: false,
    });
  };

  const handleRemoveSubtitle = (subtitleId: number) => {
    setLessonData((prevLessonData) => ({
      ...prevLessonData,
      subtitles: prevLessonData.subtitles.filter(
        (sub: any) => sub.id !== subtitleId
      ),
    }));
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
          </DialogTitle>
          <DialogDescription>
            {editingLessonId
              ? 'Update the lesson details below.'
              : 'Enter the details for your new lesson.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Lesson Title and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input
                id="lesson-title"
                placeholder="e.g. Introduction to the Course"
                value={lessonData.lessonName}
                onChange={(e) =>
                  setLessonData({ ...lessonData, lessonName: e.target.value })
                }
              />
            </div>

            {/* Chỉ hiển thị Duration nếu loại bài học là VIDEO */}
            {/* {lessonData.lessonType === 'VIDEO' && (
              <div className="space-y-2">
                <Label htmlFor="lesson-duration">Duration (e.g. 10:30)</Label>
                <Input
                  disabled={true}
                  id="lesson-duration"
                  placeholder="e.g. 10:30"
                  value={lessonData.videoDurationSeconds}
                  onChange={(e) =>
                    setLessonData({
                      ...lessonData,
                      videoDurationSeconds: e.target.value,
                    })
                  }
                />
              </div>
            )} */}
          </div>

          {/* Lesson Type and Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-type">Lesson Type</Label>
              <Select
                value={lessonData.lessonType}
                onValueChange={(value: any) =>
                  setLessonData({ ...lessonData, lessonType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 h-full pt-8">
              <input
                type="checkbox"
                id="lesson-preview"
                className="rounded border-gray-300"
                checked={lessonData.isFreePreview}
                onChange={(e) =>
                  setLessonData({
                    ...lessonData,
                    isFreePreview: e.target.checked,
                  })
                }
              />
              <label htmlFor="lesson-preview" className="text-sm">
                Make available as preview (free)
              </label>
            </div>
          </div>

          {lessonData.lessonType === 'VIDEO' && (
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="font-medium flex items-center">
                <Video className="h-4 w-4 mr-2" /> Video Content
              </h3>

              {/* Chọn nguồn video */}
              <div className="space-y-2">
                <Label htmlFor="video-source">Video Source</Label>
                <Select
                  value={lessonData.videoSourceType}
                  onValueChange={(value: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO') =>
                    setLessonData((prevLessonData) => ({
                      ...prevLessonData,
                      videoSourceType: value,
                      externalVideoInput:
                        value !== 'CLOUDINARY'
                          ? ''
                          : prevLessonData.externalVideoInput,
                      lessonVideo:
                        value === 'CLOUDINARY'
                          ? prevLessonData.lessonVideo
                          : null,
                    }))
                  }
                >
                  <SelectTrigger id="video-source">
                    <SelectValue placeholder="Select video source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLOUDINARY">
                      Upload from Computer (Cloudinary)
                    </SelectItem>
                    <SelectItem value="YOUTUBE">Embed from YouTube</SelectItem>
                    <SelectItem value="VIMEO">Embed from Vimeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hiển thị trường phù hợp dựa trên lựa chọn nguồn video */}
              {lessonData.videoSourceType === 'CLOUDINARY' && (
                <div>
                  <input
                    type="file"
                    ref={lessonVideoRef}
                    accept="video/*"
                    style={{ display: 'none' }}
                    onChange={handleLessonVideoChange}
                  />
                  {lessonData.lessonVideo ? (
                    <div className="relative">
                      <video
                        src={URL.createObjectURL(lessonData.lessonVideo)}
                        controls
                        className="w-full h-auto rounded-md aspect-video bg-black"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80"
                          onClick={() => lessonVideoRef.current?.click()}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80"
                          onClick={() =>
                            setLessonData((prevLessonData) => ({
                              ...prevLessonData,
                              lessonVideo: null,
                            }))
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => lessonVideoRef.current?.click()}
                    >
                      <Video className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Drag and drop your video here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" /> Upload Video
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {lessonData.videoSourceType === 'YOUTUBE' && (
                <div className="space-y-2">
                  <Label htmlFor="youtube-link">YouTube Video Link</Label>
                  <Input
                    id="youtube-link"
                    placeholder="Paste YouTube video link here"
                    value={lessonData.externalVideoInput || ''}
                    onChange={(e) =>
                      setLessonData((prevLessonData) => ({
                        ...prevLessonData,
                        externalVideoInput: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {lessonData.videoSourceType === 'VIMEO' && (
                <div className="space-y-2">
                  <Label htmlFor="vimeo-link">Vimeo Video Link</Label>
                  <Input
                    id="vimeo-link"
                    placeholder="Paste Vimeo video link here"
                    value={lessonData.externalVideoInput || ''}
                    onChange={(e) =>
                      setLessonData((prevLessonData) => ({
                        ...prevLessonData,
                        externalVideoInput: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Text Lesson Fields */}
          {lessonData.lessonType === 'TEXT' && (
            <div className="space-y-2 border rounded-md p-4">
              <h3 className="font-medium flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2" /> Text Content
              </h3>
              <Textarea
                id="lesson-content"
                placeholder="Enter the rich text content for this lesson..."
                className="min-h-[200px]"
                value={lessonData.textContent}
                onChange={(e) =>
                  setLessonData({ ...lessonData, textContent: e.target.value })
                }
              />
            </div>
          )}

          {/* Quiz Lesson Fields */}
          {lessonData.lessonType === 'QUIZ' && (
            <div className="space-y-4 border rounded-md p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <Book className="h-4 w-4 mr-2" /> Quiz Questions
                </h3>
                <Button variant="outline" size="sm" onClick={handleAddQuestion}>
                  <Plus className="h-4 w-4 mr-1" /> Add Question
                </Button>
              </div>

              {lessonData.questions && lessonData.questions.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {lessonData.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <p className="text-sm mt-1">
                            {question.questionText}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(question.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed rounded-md p-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    No questions added yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddQuestion}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Your First Question
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          <div className="border rounded-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <File className="h-4 w-4 mr-2" /> Lesson Attachments
              </h3>
              <div>
                <input
                  type="file"
                  ref={attachmentRef}
                  style={{ display: 'none' }}
                  onChange={handleAttachmentUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => attachmentRef.current?.click()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add File
                </Button>
              </div>
            </div>

            {lessonData.attachments && lessonData.attachments.length > 0 ? (
              <div className="space-y-2">
                {lessonData.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {attachment.fileName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center p-2">
                No attachments yet. Add files like PDF, ZIP, or other resources.
              </p>
            )}
          </div>
        </div>
        {lessonData.lessonType === 'VIDEO' &&
          lessonData.lessonVideo === 'CLOUDINARY' && (
            // <div className="border rounded-md p-4 space-y-3">
            //   <div className="flex justify-between items-center">
            //     <h3 className="font-medium flex items-center">
            //       <FileText className="h-4 w-4 mr-2" /> Lesson Subtitles
            //     </h3>
            //     <div>
            //       <input
            //         type="file"
            //         accept=".vtt"
            //         style={{ display: 'none' }}
            //         id="subtitle-upload"
            //         onChange={(e) => {
            //           if (e.target.files && e.target.files[0]) {
            //             const file = e.target.files[0];
            //             const fileUrl = URL.createObjectURL(file);
            //             setNewSubtitle({
            //               ...newSubtitle,
            //               subtitleUrl: fileUrl,
            //             });
            //           }
            //         }}
            //       />
            //       <Button
            //         variant="outline"
            //         size="sm"
            //         onClick={() =>
            //           document.getElementById('subtitle-upload')?.click()
            //         }
            //       >
            //         <Upload className="h-4 w-4 mr-1" /> Upload Subtitle
            //       </Button>
            //     </div>
            //   </div>

            //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //     <div className="space-y-2">
            //       <Label htmlFor="subtitle-language-code">Language Code</Label>
            //       <Input
            //         id="subtitle-language-code"
            //         placeholder="e.g., en, vi"
            //         value={newSubtitle.languageCode}
            //         onChange={(e) =>
            //           setNewSubtitle({
            //             ...newSubtitle,
            //             languageCode: e.target.value,
            //           })
            //         }
            //       />
            //     </div>
            //     <div className="space-y-2">
            //       <Label htmlFor="subtitle-language-name">Language Name</Label>
            //       <Input
            //         id="subtitle-language-name"
            //         placeholder="e.g., English, Tiếng Việt"
            //         value={newSubtitle.languageName}
            //         onChange={(e) =>
            //           setNewSubtitle({
            //             ...newSubtitle,
            //             languageName: e.target.value,
            //           })
            //         }
            //       />
            //     </div>
            //     <div className="flex items-center space-x-2">
            //       <input
            //         type="checkbox"
            //         id="subtitle-default"
            //         checked={newSubtitle.isDefault}
            //         onChange={(e) =>
            //           setNewSubtitle({
            //             ...newSubtitle,
            //             isDefault: e.target.checked,
            //           })
            //         }
            //       />
            //       <Label htmlFor="subtitle-default">Set as Default</Label>
            //     </div>
            //   </div>

            //   <Button variant="outline" size="sm" onClick={handleAddSubtitle}>
            //     <Plus className="h-4 w-4 mr-1" /> Add Subtitle
            //   </Button>

            //   {lessonData.subtitles && lessonData.subtitles.length > 0 ? (
            //     <div className="space-y-2 mt-4">
            //       {lessonData.subtitles.map((subtitle: any) => (
            //         <div
            //           key={subtitle.id}
            //           className="flex items-center justify-between p-2 border rounded-md"
            //         >
            //           <div>
            //             <p className="font-medium">{subtitle.languageName}</p>
            //             <p className="text-sm text-muted-foreground">
            //               {subtitle.languageCode} •{' '}
            //               {subtitle.isDefault ? 'Default' : 'Optional'}
            //             </p>
            //           </div>
            //           <Button
            //             variant="ghost"
            //             size="sm"
            //             onClick={() => handleRemoveSubtitle(subtitle.id)}
            //           >
            //             <Trash className="h-4 w-4 text-destructive" />
            //           </Button>
            //         </div>
            //       ))}
            //     </div>
            //   ) : (
            //     <p className="text-sm text-muted-foreground text-center p-2">
            //       No subtitles added yet.
            //     </p>
            //   )}
            // </div>
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> Lesson Subtitles
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtitle-language-code">Language Code</Label>
                  <Input
                    id="subtitle-language-code"
                    placeholder="e.g., en, vi"
                    value={newSubtitle.languageCode}
                    onChange={(e) =>
                      setNewSubtitle({
                        ...newSubtitle,
                        languageCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle-language-name">Language Name</Label>
                  <Input
                    id="subtitle-language-name"
                    placeholder="e.g., English, Tiếng Việt"
                    value={newSubtitle.languageName}
                    onChange={(e) =>
                      setNewSubtitle({
                        ...newSubtitle,
                        languageName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle-url">Subtitle URL</Label>
                  <Input
                    id="subtitle-url"
                    placeholder="Enter subtitle URL (e.g., https://example.com/subtitle.vtt)"
                    value={newSubtitle.subtitleUrl}
                    onChange={(e) =>
                      setNewSubtitle({
                        ...newSubtitle,
                        subtitleUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="subtitle-default"
                    checked={newSubtitle.isDefault}
                    onChange={(e) =>
                      setNewSubtitle({
                        ...newSubtitle,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                  <Label htmlFor="subtitle-default">Set as Default</Label>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleAddSubtitle}>
                <Plus className="h-4 w-4 mr-1" /> Add Subtitle
              </Button>

              {lessonData.subtitles && lessonData.subtitles.length > 0 ? (
                <div className="space-y-2 mt-4">
                  {lessonData.subtitles.map((subtitle: any) => (
                    <div
                      key={subtitle.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{subtitle.languageName}</p>
                        <p className="text-sm text-muted-foreground">
                          {subtitle.languageCode} •{' '}
                          {subtitle.isDefault ? 'Default' : 'Optional'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSubtitle(subtitle.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center p-2">
                  No subtitles added yet.
                </p>
              )}
            </div>
          )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!lessonData.lessonName.trim()}>
            {editingLessonId ? 'Update Lesson' : 'Add Lesson'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
