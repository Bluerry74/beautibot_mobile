import ChatScreen from "@/components/comerce-gpt/chatScreen";
import Scanface from "@/components/comerce-gpt/scanface";
import { useState } from "react";

export default function AIPage() {
  const [faceResult, setFaceResult] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Khi scan xong, chuyển sang chat và truyền kết quả
  const handleScanComplete = (result: any) => {
    setFaceResult(result);
    setShowChat(true);
  };

  // Khi bấm nút back ở header chat, quay lại scan
  const handleGoToScanface = () => {
    setShowChat(false);
    setFaceResult(null); // Nếu muốn reset kết quả cũ
  };

  return (
    <>
      {showChat ? (
        <ChatScreen
          faceResult={faceResult}
          onGoToScanface={handleGoToScanface}
        />
      ) : (
        <Scanface onScanComplete={handleScanComplete} />
      )}
    </>
  );
} 