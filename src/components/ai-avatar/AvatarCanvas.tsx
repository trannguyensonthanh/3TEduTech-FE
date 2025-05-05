/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ai-avatar/AvatarCanvas.tsx
import React, { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { AvatarModel } from "./AvatarModel";
import { speakText } from "../../lib/ai/ttsService";
// interface AvatarCanvasProps {
//   // Có thể thêm props sau này để điều khiển từ bên ngoài
// }
const DEFAULT_ANIMATION = "Idle";
const TALKING_ANIMATION = "Talking";
export const AvatarCanvas: React.FC<any> = () => {
  const [currentAnimation, setCurrentAnimation] =
    useState<string>(DEFAULT_ANIMATION);
  // --- 3. Thêm State mới ---
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false); // Trạng thái chờ AI (giả lập)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // Trạng thái đang nói
  const inputTextRef = useRef<HTMLInputElement>(null); // Ref cho ô input

  // --- 4. Hàm xử lý gửi yêu cầu (Giả Lập AI + Gọi TTS) ---
  const handleProcessInput = async () => {
    if (
      !inputTextRef.current ||
      !inputTextRef.current.value ||
      isLoadingAI ||
      isSpeaking
    ) {
      return; // Không xử lý nếu đang bận hoặc không có input
    }

    const prompt = inputTextRef.current.value;
    inputTextRef.current.value = ""; // Xóa input sau khi lấy giá trị
    setIsLoadingAI(true);
    setCurrentAnimation("Idle"); // Có thể thêm animation 'Thinking' nếu có

    console.log(`Processing prompt: "${prompt}"`);

    // ----- GIẢ LẬP GỌI AI -----
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Chờ 1.5 giây
    const aiResponseText = `Đây là câu trả lời cho "${prompt}". Tôi đang nói đây!`;
    // ----- KẾT THÚC GIẢ LẬP -----

    setIsLoadingAI(false);

    // Gọi hàm TTS để nói
    speakText(
      aiResponseText,
      () => {
        // onStart Callback
        setIsSpeaking(true);
        setCurrentAnimation(TALKING_ANIMATION); // <<<--- Chuyển sang animation nói
      },
      () => {
        // onEnd Callback
        setIsSpeaking(false);
        setCurrentAnimation(DEFAULT_ANIMATION); // <<<--- Quay về animation mặc định
      }
    );
  };

  const changeAnimation = (name: string) => {
    console.log("Changing animation to:", name);
    setCurrentAnimation(name);
  };

  return (
    // Thêm position relative để các nút có thể định vị tuyệt đối bên trong
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        background: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* ----- GIAO DIỆN TƯƠNG TÁC ----- */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          minWidth: "300px",
        }}
      >
        {/* Input và Nút Gửi */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            ref={inputTextRef}
            type="text"
            placeholder="Nói gì đó với avatar..."
            disabled={isLoadingAI || isSpeaking}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginRight: "10px",
              fontSize: "14px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleProcessInput();
            }}
          />
          <button
            onClick={handleProcessInput}
            disabled={isLoadingAI || isSpeaking}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isLoadingAI || isSpeaking ? "not-allowed" : "pointer",
              opacity: isLoadingAI || isSpeaking ? 0.6 : 1,
            }}
          >
            Gửi
          </button>
        </div>

        {/* Trạng thái */}
        <p
          style={{
            margin: "5px 0",
            fontSize: "14px",
            color: "#555",
          }}
        >
          <strong>Trạng thái:</strong>{" "}
          {isLoadingAI
            ? "Đang xử lý..."
            : isSpeaking
            ? "Đang nói..."
            : "Sẵn sàng"}
        </p>

        {/* Nút Test Animation */}
        <div style={{ marginTop: "10px" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Test Anim:
          </span>
          {[
            "Idle",
            "Walking",
            "Salute",
            "Nodding",
            "Thumbsup",
            "Talking",
            "Pointing",
            "Clapping",
          ].map((anim) => (
            <button
              key={anim}
              onClick={() => changeAnimation(anim)}
              style={{
                marginRight: "5px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {anim}
            </button>
          ))}
        </div>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          <strong>Current Animation:</strong> {currentAnimation}
        </p>
      </div>

      {/* ----- CANVAS ----- */}
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 2.5], fov: 50 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Ánh sáng */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, -5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />

        {/* OrbitControls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          target={[0, 0.8, 0]}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 3}
          enableRotate={true}
        />

        {/* Môi trường HDRI */}
        <Environment preset="city" />

        {/* Model */}
        <Suspense fallback={null}>
          <AvatarModel
            animationName={currentAnimation}
            position={[0, -1, 0]}
            scale={1}
          />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
};
