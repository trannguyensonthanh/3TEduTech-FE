import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Badge,
  CheckCircle,
  ChevronRight,
  File,
  FileText,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { Lesson, Resource } from "@/types/course";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LessonTabsProps {
  activeTab: "description" | "resources" | "discussions";
  setActiveTab: (tab: "description" | "resources" | "discussions") => void;
  lesson: Lesson;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleCommentSubmit: () => void;
}

const LessonTabs: React.FC<LessonTabsProps> = ({
  activeTab,
  setActiveTab,
  lesson,
  newComment,
  setNewComment,
  handleCommentSubmit,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as "description" | "resources" | "discussions")
      }
      className="px-4"
    >
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="discussions">Discussions</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <TabsContent value="description" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {lesson.description ? (
                    <p>{lesson.description}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      No description available for this lesson.
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        Understand the core concepts covered in this lesson
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Apply your knowledge to real-world examples</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>
                        Build on previous lessons to strengthen your skills
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Resources</CardTitle>
                <CardDescription>
                  Downloadable materials and helpful links for this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lesson.resources && lesson.resources.length > 0 ? (
                  <div className="space-y-4">
                    {lesson.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center">
                          {resource.type === "pdf" && (
                            <FileText className="h-5 w-5 mr-3 text-red-500" />
                          )}
                          {resource.type === "doc" && (
                            <FileText className="h-5 w-5 mr-3 text-blue-500" />
                          )}
                          {resource.type === "zip" && (
                            <File className="h-5 w-5 mr-3 text-purple-500" />
                          )}
                          {resource.type === "link" && (
                            <ChevronRight className="h-5 w-5 mr-3" />
                          )}
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {resource.size || "External resource"}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={resource.type !== "link"}
                          >
                            {resource.type === "link" ? "Visit" : "Download"}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No resources available
                    </h3>
                    <p className="text-muted-foreground">
                      There are no downloadable resources for this lesson.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Discussions</CardTitle>
                <CardDescription>
                  Discussion forum for questions and comments about this lesson
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Textarea
                    placeholder="Ask a question or share your thoughts..."
                    className="resize-none mb-2"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleCommentSubmit}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {lesson.discussions && lesson.discussions.length > 0 ? (
                  <div className="space-y-6">
                    {lesson.discussions.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage
                              src={comment.user.avatar}
                              alt={comment.user.name}
                            />
                            <AvatarFallback>
                              {comment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium">
                                {comment.user.name}
                              </h4>
                              {comment.user.isInstructor && (
                                <Badge className="ml-2 bg-primary">
                                  Instructor
                                </Badge>
                              )}
                              <span className="ml-auto text-xs text-muted-foreground">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className="mt-1">{comment.content}</p>
                            <div className="flex items-center mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="pl-12 space-y-4 mt-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage
                                    src={reply.user.avatar}
                                    alt={reply.user.name}
                                  />
                                  <AvatarFallback>
                                    {reply.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h4 className="font-medium">
                                      {reply.user.name}
                                    </h4>
                                    {reply.user.isInstructor && (
                                      <Badge className="ml-2 bg-primary">
                                        Instructor
                                      </Badge>
                                    )}
                                    <span className="ml-auto text-xs text-muted-foreground">
                                      {reply.createdAt}
                                    </span>
                                  </div>
                                  <p className="mt-1">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 mt-1"
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No discussions yet
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to start a discussion about this lesson.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default LessonTabs;
