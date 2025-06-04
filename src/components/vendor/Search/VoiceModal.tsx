import { Loader2, Mic, MicOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { VoiceRecordModalProps } from "../../../types/Search/voiceModalProps";
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { API_ENDPOINTS } from "../../../constants/apiInfo";
import { VoiceSearchResponse } from "../../../types/Search/voiceSearchResponse";

export const VoiceRecordModal = ({ isOpen, onClose, onRecordingComplete }: VoiceRecordModalProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const recorderRef = useRef<RecordRTC | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<number | null>(null);

    const startRecording = async () => {
        try {
            // Lấy stream từ microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000 // 16kHz
                }
            });

            streamRef.current = stream;            // Cấu hình RecordRTC với thiết lập tốt hơn cho Google Speech
            const recorder = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                recorderType: StereoAudioRecorder,
                numberOfAudioChannels: 1, // Mono
                desiredSampRate: 16000, // 16kHz sample rate theo yêu cầu của Google Speech
                bitsPerSecond: 256000, // Bitrate cao hơn để chất lượng tốt hơn
                disableLogs: false // Bật log để debug
            });

            recorder.startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);

            // Bắt đầu đếm thời gian
            setRecordingTime(0);
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Không thể truy cập microphone:", error);
            alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
        }
    };    // Hàm gửi audio đến backend để chuyển thành văn bản    const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
        // Kiểm tra kích thước file audio
        const fileSizeInMB = audioBlob.size / (1024 * 1024);
        console.log(`Kích thước file âm thanh: ${fileSizeInMB.toFixed(2)}MB`);

        if (fileSizeInMB > 10) {
            alert('File âm thanh quá lớn (>10MB). Vui lòng thử lại với thời gian ghi âm ngắn hơn.');
            return;
        }
        // Tạo FormData để gửi file
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav'); // Đảm bảo tên tham số 'audio' phù hợp với backend

        // Log URL để debug
        console.log('Gửi yêu cầu đến:', API_ENDPOINTS.VOICE.TRANSCRIBE.URL);

        // Gửi yêu cầu với headers phù hợp
        const response = await fetch(API_ENDPOINTS.VOICE.TRANSCRIBE.URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
                // Không cần set 'Content-Type' khi sử dụng FormData, trình duyệt sẽ tự thêm với boundary
            },
            body: formData,
        });

        const responseText = await response.text(); // Lấy response dưới dạng text để debug
        console.log('Response text:', responseText);

        // Thử phân tích response dưới dạng JSON
        let data;
        try {
            data = JSON.parse(responseText) as VoiceSearchResponse;
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            throw new Error('Không thể phân tích phản hồi từ server');
        }

        if (!response.ok) {
            console.error('API error:', data.message || response.status);
            throw new Error(`Lỗi API: ${data.message || response.status}`);
        }

        if (data.success && data.data) {
            // Trả kết quả văn bản về cho parent component
            console.log('Nhận dạng thành công:', data.data);
            onRecordingComplete(data.data);
        } else {
            console.error('Transcription failed:', data.message);
            alert(`Không thể nhận dạng giọng nói: ${data.message || 'Không có dữ liệu trả về'}`);
        }
    } catch (error) {
        console.error('Error sending audio:', error);
        alert(`Lỗi khi xử lý âm thanh: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
        setIsProcessing(false);
    }
};

const stopRecording = () => {
    if (recorderRef.current && isRecording) {
        recorderRef.current.stopRecording(() => {
            // Lấy blob đã ghi
            const audioBlob = recorderRef.current?.getBlob();

            if (audioBlob) {
                // Gửi audio đến backend để chuyển đổi thành văn bản
                sendAudioToBackend(audioBlob);
            }

            // Dừng tất cả các tracks để tắt mic
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            setIsRecording(false);
        });

        // Dừng timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

useEffect(() => {
    // Cleanup khi component unmount
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (recorderRef.current && isRecording) {
            recorderRef.current.stopRecording();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };
}, [isRecording]);

if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tìm kiếm bằng giọng nói</h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                </button>
            </div>                <div className="flex flex-col items-center py-8">
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isRecording ? 'bg-red-100' : isProcessing ? 'bg-blue-100' : 'bg-muted'}`}>
                    {isRecording ? (
                        <div className="absolute inset-0 rounded-full animate-pulse bg-red-400/30"></div>
                    ) : isProcessing ? (
                        <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400/30"></div>
                    ) : null}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : isProcessing ? 'bg-blue-500' : 'bg-primary'}`}>
                        {isRecording ? (
                            <MicOff className="w-8 h-8 text-white" />
                        ) : isProcessing ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                            <Mic className="w-8 h-8 text-white" />
                        )}
                    </div>
                </div>

                {isRecording && (
                    <div className="text-xl font-medium mb-4">
                        {formatTime(recordingTime)}
                    </div>
                )}

                <div className="text-sm text-muted-foreground mb-6">
                    {isRecording
                        ? "Đang thu âm... Nhấn dừng khi hoàn tất"
                        : isProcessing
                            ? "Đang xử lý âm thanh của bạn..."
                            : "Nhấn bắt đầu để thu âm giọng nói của bạn"}
                </div>

                <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`py-2 px-6 rounded-full font-medium text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                >
                    {isRecording ? "Dừng" : "Bắt đầu"}
                </Button>
            </div>
        </div>
    </div>
);
}