// src/components/ai-avatar/AvatarCanvas.tsx
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei'; // Thêm Html nếu cần hiển thị text trên canvas
import { AvatarModel } from './AvatarModel'; // Model 3D của bạn
import { cancelSpeech, speakText } from '../../lib/ai/ttsService'; // Dịch vụ TTS của bạn
import { Loader2 } from 'lucide-react'; // Icon loading

interface AvatarCanvasProps {
  animationName?: string; // Tên animation hiện tại (Idle, Talking, Thinking, etc.)
  textToSpeak?: string | null; // Text mà avatar cần nói
  onSpeakingStateChange?: (isSpeaking: boolean) => void; // Callback báo lại trạng thái nói
  // Thêm các props khác để tùy chỉnh camera, ánh sáng nếu cần
}
const DEFAULT_ANIMATION = 'Idle'; // Định nghĩa animation mặc định
const TALKING_ANIMATION = 'Talking'; // Định nghĩa animation nói
export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  animationName = 'Idle', // Animation mặc định
  textToSpeak,
  onSpeakingStateChange,
}) => {
  const [currentAnimationInternal, setCurrentAnimationInternal] =
    useState(animationName);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Để quản lý audio TTS

  useEffect(() => {
    setCurrentAnimationInternal(animationName);
  }, [animationName]);

  useEffect(() => {
    let isMounted = true; // Để tránh set state trên component đã unmount

    if (textToSpeak && textToSpeak.trim() !== '') {
      console.log('[AvatarCanvas] Received text to speak:', textToSpeak);
      // Hủy TTS đang chạy trước đó (nếu có)
      cancelSpeech(); // Gọi hàm cancel từ ttsService

      speakText(
        textToSpeak,
        () => {
          // onStart callback
          if (isMounted) {
            console.log(
              '[AvatarCanvas] TTS started, setting animation to Talking'
            );
            setCurrentAnimationInternal('Talking'); // Chuyển animation sang "Talking"
            onSpeakingStateChange?.(true);
          }
        },
        () => {
          // onEnd callback (khi nói xong hoặc có lỗi bị coi là end)
          if (isMounted) {
            console.log(
              '[AvatarCanvas] TTS ended, setting animation to Idle (or prop default)'
            );
            setCurrentAnimationInternal(
              animationName === 'Talking' ? 'Idle' : animationName
            ); // Quay về Idle hoặc animation gốc từ prop
            onSpeakingStateChange?.(false);
          }
        },
        (errorEvent) => {
          // onError (khi có lỗi từ SpeechSynthesis)
          if (isMounted) {
            console.error(
              '[AvatarCanvas] TTS Error in speakText:',
              errorEvent.error
            );
            setCurrentAnimationInternal(
              animationName === TALKING_ANIMATION
                ? DEFAULT_ANIMATION
                : animationName
            );
            onSpeakingStateChange?.(false);
          }
        }
      );
    } else {
      // Nếu không có textToSpeak, đảm bảo dừng TTS và quay về Idle (nếu đang Talking)
      cancelSpeech();
      if (currentAnimationInternal === 'Talking' && isMounted) {
        setCurrentAnimationInternal(animationName); // Quay về animation gốc từ prop (thường là Idle)
      }
      if (isMounted) onSpeakingStateChange?.(false);
    }

    return () => {
      isMounted = false;
      // Khi component unmount hoặc textToSpeak thay đổi, hủy TTS
      console.log(
        '[AvatarCanvas] Cleanup: Cancelling speech for text:',
        textToSpeak
      );
      cancelSpeech();
      if (isMounted) onSpeakingStateChange?.(false); // Đảm bảo state được cập nhật đúng
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textToSpeak]); // Chỉ chạy khi textToSpeak thay đổi (animationName sẽ được xử lý riêng ở trên)

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.9, 2.2], fov: 45 }} // Điều chỉnh camera cho phù hợp
        style={{ background: 'transparent' }} // Nền trong suốt để hòa vào dialog
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="studio" /> {/* Hoặc "city", "sunset" tùy bạn */}
        <Suspense
          fallback={
            <Html center>
              <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
            </Html>
          }
        >
          <AvatarModel
            animationName={currentAnimationInternal}
            position={[0, -0.95, 0]} // Điều chỉnh vị trí avatar
            scale={0.7} // Điều chỉnh kích thước
          />
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#777" transparent opacity={0.2}/>
          </mesh> */}
        </Suspense>
        <OrbitControls
          enableZoom={false} // Tắt zoom để giữ kích thước cố định
          enablePan={false}
          target={[0, 0.9, 0]} // Target vào phần đầu avatar
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 8} // Giới hạn xoay ngang nhẹ
          maxAzimuthAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
};
