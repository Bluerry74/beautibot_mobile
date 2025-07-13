import { FaceResult } from "@/types/face";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from 'expo-image-manipulator';

const FACEPP_API_URL = "https://api-us.faceplusplus.com/facepp/v3/face/analyze";
const FACEPP_API_KEY = "OIkqdC-nHNBn298gj5pdcFMbsjRKAMXm";
const FACEPP_API_SECRET = "qICi6vhejl1Zt_dfW9qcl5qdGZBtqdu0";
const FACEPP_API_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";

export const analyzeFace = async (image: string): Promise<FaceResult> => {
    // Resize và nén ảnh trước khi gửi
    const manipResult = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    // 1. Gửi ảnh lên detect để lấy face_token
    const formDataDetect = new FormData();
    formDataDetect.append("api_key", FACEPP_API_KEY);
    formDataDetect.append("api_secret", FACEPP_API_SECRET);
    formDataDetect.append("image_base64", base64);

    const detectRes = await axios.post(FACEPP_API_DETECT_URL, formDataDetect, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    const faces = detectRes.data.faces;
    if (!faces || !faces[0] || !faces[0].face_token) {
        throw new Error("Không tìm thấy khuôn mặt trong ảnh");
    }
    const faceToken = faces[0].face_token;

    // 2. Gửi face_token sang analyze
    const formDataAnalyze = new FormData();
    formDataAnalyze.append("api_key", FACEPP_API_KEY);
    formDataAnalyze.append("api_secret", FACEPP_API_SECRET);
    formDataAnalyze.append("face_tokens", faceToken);
    formDataAnalyze.append("return_attributes", "skinstatus,age,gender");

    const analyzeRes = await axios.post(FACEPP_API_URL, formDataAnalyze, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return analyzeRes.data;
};

