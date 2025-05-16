/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/courseLearn/LessonTabs.tsx
import React, { useState, FormEvent, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Added Input
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area'; // ScrollArea được dùng trong renderDiscussionsTab
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Added Badge
import { Separator } from '@/components/ui/separator'; // Added Separator
import {
  ThumbsUp,
  MessageSquare,
  FileText as FileIconLucide,
  Download,
  Loader2,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronDown,
  UserCircle,
  Info,
  PlusCircle,
  Reply,
  X as XIcon, // X đã có, đổi tên thành XIcon
  BookOpen,
  LinkIcon,
  CornerDownRight,
  Filter,
  RotateCcw,
} from 'lucide-react'; // Added Reply, XIcon

import { formatDistanceToNowStrict, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import {
  useInfiniteDiscussionThreads,
  useCreateDiscussionThread,
  useInfiniteDiscussionPosts,
  useCreateDiscussionPost,
  // useUpdateDiscussionPost, // Tạm bỏ edit post để đơn giản hóa
  useDeleteDiscussionPost,
  discussionKeys,
} from '@/hooks/queries/discussion.queries';
// import { Skeleton } from '@/components/ui/skeleton'; // Skeleton không dùng trực tiếp
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ConfirmationDialog from '@/components/instructor/courseCreate/ConfirmationDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Lesson } from '@/types/common.types';
import {
  Post,
  PostQueryParams,
  Thread,
  ThreadQueryParams,
} from '@/services/discussion.service';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- Props Interface ---
interface LessonTabsProps {
  lesson: Lesson;
  courseId: number;
  courseInstructorId: number;
  activeTab: 'description' | 'resources' | 'discussions';
  setActiveTab: (tab: 'description' | 'resources' | 'discussions') => void;
}

// --- Discussion Post Item (Component con) ---
interface DiscussionPostItemProps {
  post: Post;
  courseInstructorId: number;
  currentUserId?: number;
  onReply: (parentPost: Post) => void;
  // onEditRequest: (post: Post) => void; // Tạm bỏ edit
  onDeleteRequest: (postId: number) => void;
}
const DiscussionPostItem: React.FC<DiscussionPostItemProps> = ({
  post,
  courseInstructorId,
  currentUserId,
  onReply,
  /* onEditRequest, */ onDeleteRequest,
}) => {
  const isAuthor = currentUserId === post.accountId;
  const isInstructorPost = post.accountId === courseInstructorId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start space-x-3 py-3',
        post.parentPostId &&
          'ml-6 sm:ml-10 pl-3 border-l-2 border-dashed border-border/70 dark:border-border/30'
      )}
    >
      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border shadow-sm">
        <AvatarImage
          src={post.authorAvatar || undefined}
          alt={post.authorFullName || 'User'}
        />
        <AvatarFallback className="text-xs">
          {post.authorFullName?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-card p-3 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              {post.authorFullName || 'Anonymous User'}
            </span>
            {isInstructorPost && (
              <Badge
                variant="secondary"
                className="text-xxs h-4 px-1.5 leading-none"
              >
                Instructor
              </Badge>
            )}
          </div>
          <span
            className="text-xxs sm:text-xs text-muted-foreground"
            title={format(new Date(post.createdAt), 'PPpp')}
          >
            {formatDistanceToNowStrict(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {/* Đảm bảo postText được sanitize ở backend trước khi render với dangerouslySetInnerHTML */}
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed break-words"
          dangerouslySetInnerHTML={{
            __html: post.postText,
          }}
        />
        <div className="mt-2 flex items-center gap-0.5 -ml-1.5">
          {/* <Button variant="ghost" size="xs" className="text-xs h-7 px-1.5 text-muted-foreground hover:text-primary"><ThumbsUp size={14} className="mr-0.5"/> Like ({post.likeCount || 0})</Button> */}
          {!post.parentPostId && ( // Chỉ cho reply vào post gốc (không phải reply của reply)
            <Button
              variant="ghost"
              size="default"
              className="text-xs h-7 px-1.5 text-muted-foreground hover:text-primary"
              onClick={() => onReply(post)}
            >
              <Reply size={14} className="mr-0.5" /> Reply
            </Button>
          )}
          {isAuthor && (
            <>
              {/* <Button variant="ghost" size="xs" className="text-xs h-7 px-1.5 text-muted-foreground hover:text-primary" onClick={() => onEditRequest(post)}><Edit2 size={14} className="mr-0.5"/> Edit</Button> */}
              <Button
                variant="ghost"
                size="default"
                className="text-xs h-7 px-1.5 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteRequest(post.postId)}
              >
                <Trash2 size={14} className="mr-0.5" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main LessonTabs Component ---
const LessonTabs: React.FC<LessonTabsProps> = ({
  lesson,
  courseId,
  courseInstructorId,
  activeTab,
  setActiveTab,
}) => {
  const { userData: user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation(); // For login redirect state

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'thread' | 'post' | null;
    id: number | null;
  }>({ isOpen: false, type: null, id: null });

  const newThreadTitleInputRef = useRef<HTMLInputElement>(null);
  const newThreadTextareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const threadQueryParams: Omit<ThreadQueryParams, 'page'> = useMemo(
    () => ({
      courseId,
      lessonId: Number(lesson.lessonId),
      limit: 7,
      sortBy: 'updatedAt_desc',
    }),
    [courseId, lesson.lessonId]
  );

  const {
    data: threadsPagesData,
    fetchNextPage: fetchNextThreads,
    hasNextPage: hasNextThreads,
    isFetchingNextPage: isFetchingNextThreads,
    isLoading: isLoadingThreads,
    isError: isErrorThreads,
    refetch: refetchAllThreads, // Renamed for clarity
  } = useInfiniteDiscussionThreads(threadQueryParams, {
    enabled: activeTab === 'discussions' && !!user,
  });

  const allThreads = useMemo(
    () => threadsPagesData?.pages.flatMap((page) => page.threads) || [],
    [threadsPagesData]
  );

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const postQueryParams: Omit<PostQueryParams, 'page'> = useMemo(
    () => ({
      threadId: selectedThread ? selectedThread.threadId : undefined,
      limit: 15,
    }),
    [selectedThread?.threadId]
  );

  const {
    data: postsPagesData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    refetch: refetchPostsInThread, // Renamed for clarity
  } = useInfiniteDiscussionPosts(postQueryParams, {
    enabled: !!selectedThread && activeTab === 'discussions',
  });

  const allPostsInThread = useMemo(
    () => postsPagesData?.pages.flatMap((page) => page.posts) || [],
    [postsPagesData]
  );

  const { ref: threadsLoadMoreRef, inView: threadsInView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 100px 0px',
  });
  const { ref: postsLoadMoreRef, inView: postsInView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 100px 0px',
  });

  useEffect(() => {
    if (threadsInView && hasNextThreads && !isFetchingNextThreads)
      fetchNextThreads();
  }, [threadsInView, hasNextThreads, isFetchingNextThreads, fetchNextThreads]);
  useEffect(() => {
    if (postsInView && hasNextPosts && !isFetchingNextPosts) fetchNextPosts();
  }, [postsInView, hasNextPosts, isFetchingNextPosts, fetchNextPosts]);

  const { mutate: createThreadMutate, isPending: isCreatingThread } =
    useCreateDiscussionThread();
  const { mutate: createPostMutate, isPending: isCreatingPost } =
    useCreateDiscussionPost();
  const { mutate: deletePostMutate, isPending: isDeletingPost } =
    useDeleteDiscussionPost();

  const isProcessingDiscussion =
    isCreatingThread || isCreatingPost || isDeletingPost;

  // Auto-select first thread or clear selection
  useEffect(() => {
    if (activeTab === 'discussions') {
      if (allThreads.length === 1 && !selectedThread) {
        setSelectedThread(allThreads[0]);
      } else if (allThreads.length === 0) {
        setSelectedThread(null);
      }
    } else {
      setSelectedThread(null);
      setShowNewThreadForm(false);
    }
  }, [activeTab, allThreads, selectedThread]);

  useEffect(() => {
    if (!replyingTo) setNewPostText('');
  }, [replyingTo]);

  const handleToggleNewThreadForm = () => {
    const willShow = !showNewThreadForm;
    setShowNewThreadForm(willShow);
    setNewThreadTitle('');
    setNewPostText('');
    setReplyingTo(null);
    if (willShow) setTimeout(() => newThreadTitleInputRef.current?.focus(), 50);
  };

  const handleCreateNewThread = (e: FormEvent) => {
    e.preventDefault();
    if (
      !newThreadTitle.trim() ||
      !newPostText.trim() ||
      !user ||
      isProcessingDiscussion
    )
      return;
    createThreadMutate(
      { courseId, lessonId: Number(lesson.lessonId), title: newThreadTitle },
      {
        onSuccess: (newThreadData) => {
          // API should return the created thread with its first post or allow creating post separately
          createPostMutate(
            { threadId: newThreadData.threadId, data: { text: newPostText } },
            {
              onSuccess: (newPostData) => {
                toast({ title: 'Discussion Started' });
                setNewThreadTitle('');
                setNewPostText('');
                setShowNewThreadForm(false);
                queryClient.invalidateQueries({
                  queryKey: discussionKeys.threads(threadQueryParams),
                });
                // Optimistically set selected thread or refetch then select
                const fullNewThread = {
                  ...newThreadData,
                  posts: [newPostData],
                  postCount: 1,
                };
                setSelectedThread(fullNewThread);
              },
              onError: (err: any) =>
                toast({
                  title: 'Error',
                  description: `Could not post initial comment: ${err.message}`,
                  variant: 'destructive',
                }),
            }
          );
        },
        onError: (err: any) =>
          toast({
            title: 'Error',
            description: `Could not start thread: ${err.message}`,
            variant: 'destructive',
          }),
      }
    );
  };

  const handleReplyToPost = (parentPost: Post) => {
    const isCurrentlyReplying = replyingTo?.postId === parentPost.postId;
    setReplyingTo(isCurrentlyReplying ? null : parentPost);
    setNewPostText(isCurrentlyReplying ? '' : `@${parentPost.authorFullName} `);
    if (!isCurrentlyReplying)
      setTimeout(() => replyTextareaRef.current?.focus(), 50);
  };

  const handleSubmitReplyOrNewPostInThread = () => {
    if (!newPostText.trim() || !user || !selectedThread || isCreatingPost)
      return;
    createPostMutate(
      {
        threadId: selectedThread.threadId,
        data: { text: newPostText, parentPostId: replyingTo?.postId },
      },
      {
        onSuccess: () => {
          toast({ title: replyingTo ? 'Reply Posted' : 'Comment Posted' });
          setNewPostText('');
          setReplyingTo(null);
          queryClient.invalidateQueries({
            queryKey: discussionKeys.posts(postQueryParams),
          });
          queryClient.invalidateQueries({
            queryKey: discussionKeys.threads(threadQueryParams),
          });
        },
        onError: (e: any) =>
          toast({
            title: 'Error',
            description: e.message,
            variant: 'destructive',
          }),
      }
    );
  };

  const handleDeletePostRequest = (postId: number) => {
    setDeleteConfirm({ isOpen: true, type: 'post', id: postId });
  };

  const confirmDeleteAction = () => {
    if (
      deleteConfirm.id === null ||
      deleteConfirm.type !== 'post' ||
      !selectedThread
    )
      return;
    deletePostMutate(
      { postId: deleteConfirm.id, threadId: selectedThread.threadId },
      {
        onSuccess: () => {
          toast({ title: 'Comment Deleted' });
          queryClient.invalidateQueries({
            queryKey: discussionKeys.posts(postQueryParams),
          });
          queryClient.invalidateQueries({
            queryKey: discussionKeys.threads(threadQueryParams),
          });
        },
        onError: (e: any) =>
          toast({
            title: 'Delete Failed',
            description: e.message,
            variant: 'destructive',
          }),
        onSettled: () =>
          setDeleteConfirm({ isOpen: false, type: null, id: null }),
      }
    );
  };

  // --- Render Content for Each Tab ---
  const renderOverviewTab = () => (
    <Card className="shadow-none border-0 bg-transparent">
      <CardHeader className="px-1 pt-0 pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Info size={22} className="text-primary shrink-0" /> Lesson Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-foreground/90">
          {lesson.description ? (
            <p className="whitespace-pre-wrap">{lesson.description}</p>
          ) : (
            <p className="text-muted-foreground italic">
              No detailed description available for this lesson.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderResourcesTab = () => (
    <Card className="shadow-none border-0 bg-transparent">
      <CardHeader className="px-1 pt-0 pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Download size={22} className="text-primary shrink-0" /> Downloadable
          Resources
        </CardTitle>
        {lesson.attachments && lesson.attachments.length > 0 && (
          <CardDescription className="text-sm">
            Materials provided by the instructor for this lesson.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-1">
        {lesson.attachments && lesson.attachments.length > 0 ? (
          <div className="space-y-3">
            {lesson.attachments.map((resource) => (
              <a
                key={resource.attachmentId || resource.fileUrl}
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileIconLucide
                    size={24}
                    className="text-primary group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-medium text-sm group-hover:text-primary truncate"
                      title={resource.fileName}
                    >
                      {resource.fileName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {resource.fileType && (
                        <span>{resource.fileType.toUpperCase()}</span>
                      )}
                      {resource.fileSize && (
                        <span>
                          • {(resource.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Download
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
            <FileIconLucide className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <h3 className="text-md font-medium">No Resources Available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There are no downloadable materials for this lesson.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDiscussionsTab = () => (
    <Card className="shadow-none border-0 bg-transparent">
      <CardHeader className="px-1 pt-0 pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl font-semibold">
              Q&A and Discussions
            </CardTitle>
            <CardDescription className="text-sm">
              Ask questions or share insights on this lesson.
            </CardDescription>
          </div>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleNewThreadForm}
              className="w-full sm:w-auto shrink-0"
            >
              {showNewThreadForm ? (
                <XIcon size={16} className="mr-1.5" />
              ) : (
                <PlusCircle size={16} className="mr-1.5" />
              )}
              {showNewThreadForm ? 'Cancel New Thread' : 'Start New Discussion'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        <AnimatePresence>
          {showNewThreadForm && user && (
            <motion.form
              initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                marginTop: '0rem',
                marginBottom: '1.5rem',
              }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onSubmit={handleCreateNewThread}
              className="p-4 border rounded-lg bg-muted/30 dark:bg-muted/10 space-y-3"
            >
              <Input
                ref={newThreadTitleInputRef}
                id="new-thread-title-input"
                placeholder="Thread Title (e.g., Question about HTML forms)"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                required
                className="text-sm font-medium bg-card h-9"
              />
              <Textarea
                ref={newThreadTextareaRef}
                placeholder="Your question or discussion point..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                rows={3}
                required
                className="text-sm bg-card"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    isProcessingDiscussion ||
                    !newThreadTitle.trim() ||
                    !newPostText.trim()
                  }
                >
                  {(isCreatingThread || isCreatingPost) && (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  )}{' '}
                  Post Discussion
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {!user && (
          <div className="py-10 text-center border border-dashed rounded-lg bg-muted/20">
            <UserCircle
              size={40}
              className="mx-auto mb-3 text-muted-foreground opacity-40"
            />
            <p className="font-medium">
              Please{' '}
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="text-primary hover:underline font-semibold"
              >
                log in
              </Link>{' '}
              to participate in discussions.
            </p>
          </div>
        )}

        {user && isLoadingThreads && (
          <div className="py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        )}
        {user && !isLoadingThreads && isErrorThreads && (
          <div className="text-destructive text-center py-5 bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="inline-block mr-2" /> Error loading
            discussions.
            <Button
              variant="link"
              onClick={() => refetchAllThreads()}
              className="p-0 h-auto ml-1"
            >
              Retry
            </Button>
          </div>
        )}
        {user &&
          !isLoadingThreads &&
          !isErrorThreads &&
          allThreads.length === 0 &&
          !showNewThreadForm && (
            <div className="py-10 text-center border border-dashed rounded-lg bg-muted/20">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <h4 className="font-medium">No Discussions Yet</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to ask a question or share something!
              </p>
            </div>
          )}

        {user && allThreads.length > 0 && (
          <div className="space-y-3 mt-4">
            {allThreads.map((thread) => (
              <Card
                key={thread.threadId}
                className={cn(
                  'shadow-sm transition-all duration-200 ease-in-out',
                  selectedThread?.threadId === thread.threadId &&
                    'border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary/10'
                )}
              >
                <CardHeader
                  className="p-3 sm:p-4 cursor-pointer hover:bg-muted/30 dark:hover:bg-muted/20 rounded-t-lg"
                  onClick={() =>
                    setSelectedThread(
                      selectedThread?.threadId === thread.threadId
                        ? null
                        : thread
                    )
                  }
                >
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2 hover:text-primary flex-1">
                      {thread.title}
                    </CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        selectedThread?.threadId === thread.threadId
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1.5 pt-1 text-muted-foreground">
                    <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                      <AvatarImage src={thread.creatorAvatar || undefined} />
                      <AvatarFallback className="text-xxs">
                        {thread.creatorFullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">
                      {thread.creatorFullName || 'User'}
                    </span>
                    <span>
                      •{' '}
                      {formatDistanceToNowStrict(new Date(thread.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="ml-auto">
                      {thread.postCount || 0} replies
                    </span>
                  </CardDescription>
                </CardHeader>
                <AnimatePresence initial={false}>
                  {selectedThread?.threadId === thread.threadId && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                      }}
                    >
                      <CardContent className="p-3 sm:p-4 border-t bg-background/50 dark:bg-background/30 rounded-b-lg">
                        {isLoadingPosts && !allPostsInThread.length && (
                          <div className="py-5 text-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                          </div>
                        )}
                        {isErrorPosts && !isLoadingPosts && (
                          <div className="text-destructive text-center py-3 text-xs">
                            Error loading replies.{' '}
                            <Button
                              variant="link"
                              size="default"
                              onClick={() => refetchPostsInThread()}
                              className="p-0 h-auto"
                            >
                              Retry
                            </Button>
                          </div>
                        )}

                        {/* ScrollArea for posts */}
                        <ScrollArea className="max-h-[calc(100vh-var(--main-content-header-height,64px)-var(--lesson-tabs-height,44px)-var(--lesson-footer-nav-height,0px)-var(--thread-header-height,100px)-var(--reply-form-height,150px)-10rem)] min-h-[100px] pr-2 custom-scrollbar">
                          {' '}
                          {/* Adjust min-h and max-h */}
                          {allPostsInThread.length > 0 && (
                            <div className="space-y-0.5 divide-y divide-border dark:divide-border/30 -my-3">
                              {allPostsInThread.map((post) => (
                                <DiscussionPostItem
                                  key={post.postId}
                                  post={post}
                                  onReply={handleReplyToPost}
                                  onDeleteRequest={handleDeletePostRequest}
                                  currentUserId={user?.accountId}
                                  courseInstructorId={courseInstructorId}
                                />
                              ))}
                            </div>
                          )}
                          {hasNextPosts && (
                            <div
                              ref={postsLoadMoreRef}
                              className="pt-3 text-center"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchNextPosts()}
                                disabled={isFetchingNextPosts}
                              >
                                {isFetchingNextPosts ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                                ) : (
                                  'Load More Replies'
                                )}
                              </Button>
                            </div>
                          )}
                        </ScrollArea>

                        {allPostsInThread.length === 0 &&
                          !isLoadingPosts &&
                          !isErrorPosts && (
                            <p className="text-xs text-muted-foreground py-4 text-center">
                              No replies yet. Be the first to share your
                              thoughts!
                            </p>
                          )}

                        {/* Form Reply */}
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="text-sm font-medium mb-1.5">
                            {replyingTo
                              ? `Replying to ${replyingTo.authorFullName}:`
                              : `Post a reply to "${thread.title}":`}
                          </h5>
                          <Textarea
                            ref={replyTextareaRef}
                            id={`reply-textarea-${thread.threadId}`}
                            placeholder={
                              replyingTo
                                ? 'Write your reply...'
                                : 'Share your thoughts...'
                            }
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            rows={replyingTo ? 3 : 2}
                            className="text-sm mb-2 bg-card"
                          />
                          <div className="flex justify-end gap-2">
                            {replyingTo && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setNewPostText('');
                                }}
                              >
                                Cancel Reply
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() =>
                                handleSubmitReplyOrNewPostInThread()
                              }
                              disabled={isCreatingPost || !newPostText.trim()}
                            >
                              {isCreatingPost && (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                              )}{' '}
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
            {hasNextThreads && (
              <div ref={threadsLoadMoreRef} className="pt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextThreads()}
                  disabled={isFetchingNextThreads}
                >
                  {isFetchingNextThreads ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More Discussions
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
  console.log('allThreads', allThreads);
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as any)}
      className="w-full flex flex-col h-full"
    >
      <TabsList className="grid w-full grid-cols-3 sticky top-[var(--learning-content-header-height)] bg-card/95 backdrop-blur-sm z-10 border-b shadow-sm shrink-0 h-11">
        <TabsTrigger
          value="description"
          className="h-full text-xs sm:text-sm px-2"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="resources"
          className="h-full text-xs sm:text-sm px-2"
        >
          Resources ({(lesson.attachments || []).length})
        </TabsTrigger>
        <TabsTrigger
          value="discussions"
          className="h-full text-xs sm:text-sm px-2"
        >
          Q&A
        </TabsTrigger>
      </TabsList>
      <div className="mt-0 py-4 sm:py-6 px-2 sm:px-4 focus-visible:outline-none flex-grow !overflow-y-auto custom-scrollbar">
        {activeTab === 'description' && renderOverviewTab()}
        {activeTab === 'resources' && renderResourcesTab()}
        {activeTab === 'discussions' && renderDiscussionsTab()}
      </div>
      <ConfirmationDialog
        open={deleteConfirm.isOpen}
        onOpenChange={(openStatus) => {
          if (!openStatus)
            setDeleteConfirm({ isOpen: false, id: null, type: null });
        }}
        onConfirm={confirmDeleteAction}
        title={
          deleteConfirm.type === 'post'
            ? 'Delete Comment?'
            : 'Delete Discussion?'
        } // Title tùy theo type
        description={`Are you sure you want to delete this ${
          deleteConfirm.type || 'item'
        }? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isConfirming={isDeletingPost /* || isDeletingThread */}
      />
    </Tabs>
  );
};

export default LessonTabs;
