// src/components/courseLearn/LessonContentRenderer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card'; // Bỏ CardHeader, CardTitle
import { useLessonVideoUrl } from '@/hooks/queries/lesson.queries';
import {
  getYoutubeEmbedUrl,
  getVimeoEmbedUrl,
  extractYoutubeId,
  extractVimeoId,
} from '@/utils/video.util';
import {
  Loader2,
  Video as VideoIcon,
  FileText as TextIcon,
  HelpCircle as QuizIcon,
  AlertTriangle,
} from 'lucide-react';
import QuizPlayer from './QuizPlayer';
import { Lesson } from '@/types/common.types';
import { QuizAttemptResultResponse } from '@/services/quiz.service';
// import { useToast } from '@/hooks/use-toast'; // Không thấy sử dụng toast ở đây, có thể bỏ
// import { Skeleton } from '@/components/ui/skeleton'; // Skeleton không được dùng trực tiếp, Loader2 thay thế

interface LessonContentRendererProps {
  lesson: Lesson & { lastWatchedPosition?: number; isCompleted?: boolean }; // Thêm lastWatchedPosition và isCompleted
  courseId: number;
  onQuizCompleted: (result: QuizAttemptResultResponse) => void;
  onVideoProgressUpdate?: (lessonId: number | string, position: number) => void;
  onVideoEnded?: (lessonId: number | string) => void;
  markLessonCompleted: (payload: {
    lessonId: number;
    isCompleted: boolean;
  }) => void; // Thêm prop này
}

const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  courseId,
  onQuizCompleted,
  onVideoProgressUpdate,
  onVideoEnded,
  markLessonCompleted, // Nhận prop
}) => {
  // const { toast } = useToast();
  const [videoUrlToPlay, setVideoUrlToPlay] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true); // Mặc định là true khi lesson thay đổi
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const lessonIdForSignedUrl =
    lesson.lessonType === 'VIDEO' &&
    lesson.videoSourceType === 'CLOUDINARY' &&
    lesson.externalVideoId
      ? Number(lesson.lessonId)
      : undefined;

  const {
    data: signedUrlData,
    isLoading: isLoadingSignedUrl,
    isError: isSignedUrlError,
    error: signedUrlErrorObj,
  } = useLessonVideoUrl(lessonIdForSignedUrl, {
    enabled: !!lessonIdForSignedUrl,
    staleTime: 1000 * 60 * 45,
    refetchOnMount: true, // Quan trọng để lấy URL mới nếu component từng unmount/remount
    refetchOnWindowFocus: false, // Tránh fetch lại không cần thiết khi focus cửa sổ
  });

  useEffect(() => {
    // Reset states when lesson changes
    setIsLoadingVideo(true);
    setVideoError(null);
    setVideoUrlToPlay(null);
    let newUrl: string | null = null;

    console.log(
      `[Renderer] Effect for lesson: ${lesson.lessonName} (ID: ${lesson.lessonId}), Type: ${lesson.lessonType}`
    );

    if (lesson.lessonType === 'VIDEO') {
      const source = lesson.videoSourceType;
      const extId = lesson.externalVideoId;
      console.log(`[Renderer] Video Source: ${source}, External ID: ${extId}`);

      if (source === 'CLOUDINARY') {
        if (extId) {
          if (isLoadingSignedUrl) {
            console.log(
              `[Renderer] Cloudinary: Waiting for signed URL for lesson ${lesson.lessonId}`
            );
            // setIsLoadingVideo(true) đã set ở trên
          } else if (signedUrlData?.signedUrl) {
            newUrl = signedUrlData.signedUrl;
            console.log(
              `[Renderer] Cloudinary: Using signed URL - ${newUrl.substring(
                0,
                50
              )}...`
            );
            setIsLoadingVideo(false);
          } else if (isSignedUrlError) {
            const errMsg =
              (signedUrlErrorObj as Error)?.message ||
              'Could not load Cloudinary video.';
            console.error(
              `[Renderer] Cloudinary: Error fetching signed URL: ${errMsg}`
            );
            setVideoError(errMsg);
            setIsLoadingVideo(false);
          } else {
            // Not loading, no error, but no URL (e.g., signed URL expired before component unmounted and remounted)
            console.warn(
              `[Renderer] Cloudinary: No signed URL data available after loading for lesson ${lesson.lessonId}. Possibly stale or refetch needed.`
            );
            setVideoError(
              'Video resource is temporarily unavailable. Please try again shortly.'
            ); // Hoặc chờ refetchOnMount
            setIsLoadingVideo(false); // Hoặc có thể để true nếu mong muốn query tự refetch
          }
        } else {
          console.warn(
            `[Renderer] Cloudinary: Missing externalVideoId for lesson ${lesson.lessonId}`
          );
          setVideoError('Video source is misconfigured (missing ID).');
          setIsLoadingVideo(false);
        }
      } else if (source === 'YOUTUBE' && extId) {
        const youtubeId = extractYoutubeId(extId) || extId;
        newUrl = getYoutubeEmbedUrl(youtubeId);
        console.log(`[Renderer] YouTube: Embed URL - ${newUrl}`);
        setIsLoadingVideo(false);
      } else if (source === 'VIMEO' && extId) {
        const vimeoId = extractVimeoId(extId) || extId;
        newUrl = getVimeoEmbedUrl(vimeoId);
        console.log(`[Renderer] Vimeo: Embed URL - ${newUrl}`);
        setIsLoadingVideo(false);
      } else if (source && !extId) {
        console.warn(
          `[Renderer] Missing Video ID/URL for ${source} source, lesson ${lesson.lessonId}`
        );
        setVideoError(`Missing Video ID/URL for ${source} source.`);
        setIsLoadingVideo(false);
      } else if (!source && extId) {
        // Có ID nhưng không có source type
        console.warn(
          `[Renderer] Missing videoSourceType for lesson ${lesson.lessonId} but has externalId.`
        );
        setVideoError('Video source type is not specified.');
        setIsLoadingVideo(false);
      } else {
        // Không có source type hoặc không phải là video định dạng được hỗ trợ
        console.log(
          `[Renderer] Lesson ${lesson.lessonId} is not a known video type or has no source.`
        );
        setIsLoadingVideo(false); // If not a video, stop loading indicator
      }
    } else {
      // Not a video lesson
      setIsLoadingVideo(false);
    }
    setVideoUrlToPlay(newUrl);
  }, [
    lesson.lessonId,
    lesson.lessonName,
    lesson.lessonType,
    lesson.videoSourceType,
    lesson.externalVideoId,
    signedUrlData,
    isLoadingSignedUrl,
    isSignedUrlError,
    signedUrlErrorObj,
  ]);

  // Effect to handle video resume
  useEffect(() => {
    const videoElement = videoRef.current;
    if (
      videoElement &&
      videoUrlToPlay &&
      lesson.videoSourceType === 'CLOUDINARY' &&
      typeof lesson.lastWatchedPosition === 'number' &&
      lesson.lastWatchedPosition > 0
    ) {
      const startPosition = lesson.lastWatchedPosition;
      console.log(
        `[Renderer] Cloudinary: Attempting to resume video ${lesson.lessonId} at ${startPosition}s`
      );

      const onCanPlay = () => {
        // Check if still the same video to avoid race conditions on fast lesson changes
        if (
          videoElement.currentSrc === videoUrlToPlay &&
          videoElement.readyState >= 2
        ) {
          // HAVE_CURRENT_DATA or more
          console.log(
            `[Renderer] Cloudinary: 'canplay' event. Setting currentTime to ${startPosition} for ${lesson.lessonId}`
          );
          videoElement.currentTime = startPosition;
        }
        videoElement.removeEventListener('canplay', onCanPlay); // Clean up listener
      };

      // Ensure listener is added only once or cleaned up properly
      videoElement.removeEventListener('canplay', onCanPlay); // Remove previous if any
      videoElement.addEventListener('canplay', onCanPlay);

      // Fallback if already playable (e.g., if canplay fired before this effect)
      if (videoElement.readyState >= 2) {
        console.log(
          `[Renderer] Cloudinary: Already playable. Setting currentTime to ${startPosition} for ${lesson.lessonId}`
        );
        videoElement.currentTime = startPosition;
        videoElement.removeEventListener('canplay', onCanPlay); // Clean up if fallback used
      }
    }
    // Cleanup function to remove listener if component unmounts or dependencies change before canplay
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('canplay', () => {}); // Pass empty fn or the named fn if stored
      }
    };
  }, [
    videoUrlToPlay,
    lesson.lastWatchedPosition,
    lesson.videoSourceType,
    lesson.lessonId,
  ]);

  const handleTimeUpdate = () => {
    if (
      videoRef.current &&
      onVideoProgressUpdate &&
      lesson.videoSourceType === 'CLOUDINARY'
    ) {
      onVideoProgressUpdate(
        lesson.lessonId,
        Math.floor(videoRef.current.currentTime)
      );
    }
  };

  const handleVideoEnded = () => {
    if (onVideoEnded && lesson.videoSourceType === 'CLOUDINARY') {
      onVideoEnded(lesson.lessonId); // Parent (CourseLearningPage) will call markLessonCompleted
    }
    // For YouTube/Vimeo, onEnded is harder to track reliably from iframe.
    // Marking complete for YT/Vimeo might rely on user action or estimated duration.
  };
  useEffect(() => {
    if (lesson && !lesson.isCompleted) {
      // Giả sử lesson object có trường isCompleted được cập nhật từ CourseLearningPage
      markLessonCompleted({
        lessonId: Number(lesson.lessonId),
        isCompleted: true,
      });
    }
  }, [lesson, markLessonCompleted]);
  // --- Render VIDEO ---
  if (lesson.lessonType === 'VIDEO') {
    return (
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl animate-fadeIn max-w-full w-full">
        <AspectRatio ratio={16 / 9} className="relative">
          {isLoadingVideo && (
            <div className="w-full h-full flex items-center justify-center bg-gray-900/80">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
          )}
          {!isLoadingVideo && videoError && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/50 text-red-300 p-4 text-center">
              <AlertTriangle className="h-10 w-10 mb-2" />
              <p className="font-medium">Video Playback Error</p>
              <p className="text-xs mt-1">{videoError}</p>
            </div>
          )}
          {!isLoadingVideo &&
            !videoError &&
            videoUrlToPlay &&
            (lesson.videoSourceType === 'CLOUDINARY' ? (
              <video
                ref={videoRef}
                key={videoUrlToPlay} // Re-mount video element if URL changes
                src={videoUrlToPlay}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={(e) => {
                  console.error('HTML5 Video Error:', e);
                  setVideoError(
                    'Failed to load video. The link might be invalid, expired, or network issue.'
                  );
                }}
              />
            ) : (
              // YouTube or Vimeo
              <iframe
                key={videoUrlToPlay}
                src={`${videoUrlToPlay}${
                  videoUrlToPlay.includes('?') ? '&' : '?'
                }autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&color=white`}
                title={lesson.lessonName}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ))}
          {!isLoadingVideo && !videoError && !videoUrlToPlay && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/60 text-gray-500 p-4 text-center">
              <VideoIcon className="h-12 w-12 mb-2 opacity-50" />
              <p>Video content is not available for this lesson.</p>
            </div>
          )}
        </AspectRatio>
      </div>
    );
  }

  // --- Render TEXT ---
  if (lesson.lessonType === 'TEXT') {
    // Tự động đánh dấu hoàn thành khi Text lesson được render (nếu chưa hoàn thành)

    return (
      <Card className="shadow-lg animate-fadeIn border-none bg-transparent sm:bg-card sm:border">
        <CardContent className="p-0 sm:p-6">
          <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none lg:prose-lg xl:prose-xl mx-auto py-1 leading-relaxed">
            {lesson.textContent ? (
              // Đảm bảo lesson.textContent đã được sanitize ở backend
              <div
                dangerouslySetInnerHTML={{
                  __html: lesson.textContent,
                }}
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <TextIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="italic">No content available for this lesson.</p>
              </div>
            )}
          </article>
        </CardContent>
      </Card>
    );
  }

  // --- Render QUIZ ---
  if (lesson.lessonType === 'QUIZ') {
    return (
      <div className="animate-fadeIn max-w-2xl mx-auto">
        <QuizPlayer
          lessonId={lesson.lessonId}
          lessonName={lesson.lessonName}
          courseId={courseId}
          // initialQuestions={lesson.questions} // QuizPlayer sẽ tự fetch questions khi start attempt
          onQuizComplete={onQuizCompleted}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-8 text-center text-muted-foreground animate-fadeIn min-h-[300px] flex items-center justify-center">
      Unsupported lesson type or content could not be loaded.
    </div>
  );
};

export default LessonContentRenderer;
