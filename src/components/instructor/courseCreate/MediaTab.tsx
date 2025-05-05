import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Image, Trash, Edit, Upload, Video, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MediaTabProps {
  thumbnail: File | null;
  thumbnailPreview: string | null;
  promoVideo: File | null;
  promoVideoPreview: string | null;
  setThumbnail: (file: File | null) => void;
  setThumbnailPreview: (preview: string | null) => void;
  setPromoVideo: (file: File | null) => void;
  setPromoVideoPreview: (preview: string | null) => void;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  promoVideoUrl: string;
  setPromoVideoUrl: (url: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({
  thumbnail,
  thumbnailPreview,
  promoVideo,
  promoVideoPreview,
  setThumbnail,
  setThumbnailPreview,
  setPromoVideo,
  setPromoVideoPreview,
  handleThumbnailChange,
  // handleVideoChange,
  promoVideoUrl,
  setPromoVideoUrl,
}) => {
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thumbnail Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Course Thumbnail</CardTitle>
            <CardDescription>
              Upload a high-quality image that represents your course (16:9
              ratio recommended)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={thumbnailRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleThumbnailChange}
            />

            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Course thumbnail"
                  className="w-full h-auto rounded-md object-cover aspect-video"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => thumbnailRef.current?.click()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => thumbnailRef.current?.click()}
              >
                <Image className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Drag and drop your thumbnail here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-2">
              Recommended size: 1280x720 pixels, Max file size: 10MB
            </p>
          </CardContent>
        </Card>

        {/* Promotional Video Upload */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Promotional Video</CardTitle>
            <CardDescription>
              Upload a short video introducing your course (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={videoRef}
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleVideoChange}
            />

            {promoVideoPreview ? (
              <div className="relative">
                <video
                  src={promoVideoPreview}
                  controls
                  className="w-full h-auto rounded-md aspect-video bg-black"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => videoRef.current?.click()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80"
                    onClick={() => {
                      setPromoVideo(null);
                      setPromoVideoPreview(null);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => videoRef.current?.click()}
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

            <p className="text-xs text-muted-foreground mt-2">
              Recommended length: 2-5 minutes, Max file size: 500MB
            </p>
          </CardContent>
        </Card> */}
        <div className="space-y-4">
          <Label htmlFor="promo-video-url">Promo Video URL</Label>
          <Input
            id="promo-video-url"
            placeholder="Enter promo video URL (e.g., https://www.youtube.com/watch?v=...)"
            value={promoVideoUrl}
            onChange={(e) => setPromoVideoUrl(e.target.value)}
          />
          {promoVideoUrl && (
            <div className="aspect-video bg-gray-900 rounded-md overflow-hidden">
              <iframe
                src={promoVideoUrl.replace('watch?v=', 'embed/')}
                title="Promo Video Preview"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Media Tips */}
      <div className="bg-muted/50 rounded-md p-4 flex items-start space-x-3">
        <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <h3 className="font-medium mb-1">Media Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
            <li>
              High-quality thumbnails can increase enrollment by up to 70%
            </li>
            <li>
              Promotional videos help students understand what your course
              offers
            </li>
            <li>
              Use professional-looking visuals that clearly represent your
              course content
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
