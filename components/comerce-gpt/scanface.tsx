import { useAnalyzeFaceMutation } from "@/tanstack/face";
import { FaceResult } from "@/types/face";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Ellipse, Mask, Rect } from 'react-native-svg';

const Scanface = ({ onScanComplete }: { onScanComplete: (result: FaceResult) => void }) => {
  const facing = 'front';
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const countdownTimer = async (seconds: number): Promise<void> => {
    for (let i = seconds; i > 0; i--) {
      setCountdown(i);
      await new Promise(res => setTimeout(res, 1000));
    }
    setCountdown(null);
  };

  const takePhotoWithCountdown = async () => {
    setIsCapturing(true);
    await countdownTimer(5);
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        setCapturedPhoto(photo.uri);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
      }
    }
    setIsCapturing(false);
  };

  const analyzeFaceMutation = useAnalyzeFaceMutation();

  useEffect(() => {
    if (analyzeFaceMutation.isSuccess && analyzeFaceMutation.data) {
      onScanComplete(analyzeFaceMutation.data);
    }
  }, [analyzeFaceMutation.isSuccess, analyzeFaceMutation.data, onScanComplete]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Ứng dụng cần quyền truy cập camera để tư vấn tình trạng da của bạn. Bạn có đồng ý cấp quyền không?</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Đồng ý cấp quyền camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (permission?.granted && !showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Chúng tôi sẽ tiến hành kiểm tra tình trạng da của bạn.</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          setShowCamera(true);
          setCapturedPhoto(null);
          setTimeout(() => {
            takePhotoWithCountdown();
          }, 500);
        }}>
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {permission?.granted && showCamera ? (
        <>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

          {/* Chỉ hiển thị frame và mask khi đang chụp */}
          {isCapturing && (
            <>
              <Svg
                style={styles.focusMask}
                width="100%"
                height="100%"
                viewBox="0 -35 400 700"
              >
                <Defs>
                  <Mask id="mask" x="0" y="-30" width="500" height="800">
                    <Rect x="0" y="-30" width="500" height="800" fill="white" />
                    <Ellipse
                      cx="200"
                      cy="300"
                      rx="130"
                      ry="170"
                      fill="black"
                    />
                  </Mask>
                </Defs>
                <Rect
                  x="0"
                  y="-30"
                  width="500"
                  height="800"
                  fill="rgba(0,0,0,0.6)"
                  mask="url(#mask)"
                />
                <Ellipse
                  cx="200"
                  cy="300"
                  rx="130"
                  ry="170"
                  stroke="#fff"
                  strokeWidth="4"
                  fill="none"
                />
              </Svg>
              <Image
                source={require('../../assets/images/frame.png')}
                style={styles.faceFrame}
              />
              {countdown !== null && (
                <View style={styles.countdownContainerBelowFrame}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              )}
              <View style={styles.focusTextContainerBelowCountdown}>
                <Text style={styles.focusText}>Hãy đưa khuôn mặt vào khung</Text>
              </View>
            </>
          )}

          {capturedPhoto && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>Ảnh đã chụp:</Text>
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            </View>
          )}

          {capturedPhoto && !isCapturing && (
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setCapturedPhoto(null);
                  setTimeout(() => {
                    takePhotoWithCountdown();
                  }, 500);
                }}
              >
                <Text style={styles.buttonText}>Chụp lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  analyzeFaceMutation.mutate(capturedPhoto);
                }}
                disabled={analyzeFaceMutation.isPending}
              >
                <Text style={styles.buttonText}>
                  {analyzeFaceMutation.isPending ? "Đang gửi..." : "Gửi"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.container}>
          <Text style={styles.message}>Đang yêu cầu quyền truy cập camera...</Text>
        </View>
      )}
    </View>
  );
};

export default Scanface;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3EC',
    padding: 20,
  },
  message: {
    color: '#000',
    paddingBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownContainerBelowFrame: {
    position: 'absolute',
    left: '50%',
    top: '75%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 22,
  },
  countdownText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  controlRow: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ff9c86',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    position: 'absolute',
    top: 230,
    left: 20,
    right: 20,
    bottom: 20,
    alignItems: 'center',
  },
  previewText: {
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 260,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#fff',
  },
  focusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  focusCircle: {
    width: 240,
    height: 320,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: '#00e0ff',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
  },
  focusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  faceFrame: {
    position: 'absolute',
    width: 320,
    height: 420,
    top: '15%',
    left: '50%',
    transform: [{ translateX: -160 }, { translateY: 90 }],
    zIndex: 20,
    opacity: 0.2,
  },
  focusMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 21,
  },
  focusTextContainer: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
  },
  focusTextContainerBelowCountdown: {
    position: 'absolute',
    top: '88%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
  },
});