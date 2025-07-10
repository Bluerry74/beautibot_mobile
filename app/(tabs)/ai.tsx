import ChatScreen from "@/components/comerce-gpt/chatScreen";
import ScanFace from "@/components/comerce-gpt/scanface";
import { FaceResult } from "@/types/face";
import { useState } from "react";

export default function AI() {
    const [scanDone, setScanDone] = useState(false);
    const [faceResult, setFaceResult] = useState<FaceResult | null>(null);

    return (
        <>
            {!scanDone ? (
                <ScanFace
                    onScanComplete={(result) => {
                        setFaceResult(result);
                        setScanDone(true);
                    }}
                />
            ) : (
                <ChatScreen faceResult={faceResult} />
            )}
        </>
    );
} 