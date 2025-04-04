"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Mic, Volume2, Languages } from "lucide-react";

// Language list aligned with backend's BCP-47 codes
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
];

type TranslationResult = {
  source_transcription: string;
  translated_text: string;
  tts_audio_url: string;
};

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Media recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Change default values
  
  // Cache busting mechanism
  const generateCacheBuster = () => new URLSearchParams({
    ts: Date.now().toString()
  }).toString();

  

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  

  const processAudio = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      
      formData.append(
        'audio_file', 
        audioBlob, 
        `recording_${Date.now()}.webm`  // Explicit extension
      );
      formData.append('source_lang', sourceLanguage);
      formData.append('target_lang', targetLanguage);

      // Add this at the top of your component
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://medical-translation-api.onrender.com";

      // Update the processAudio function's fetch call
      const response = await fetch(`${BACKEND_URL}/api/v1/medical-translate?${generateCacheBuster()}`, {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: formData
});
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const result: TranslationResult = await response.json();
      
      setSourceText(result.source_transcription);
      setTranslatedText(result.translated_text);
      setAudioUrl(`${result.tts_audio_url}?${generateCacheBuster()}`);

    } catch (error) {
      console.error("Processing error:", error);
      alert("Translation failed. Please try again.");
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  };

  const startRecording = async () => {
    try {
      resetState();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: true,
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm' 
      });
  
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorder.start(1000);
      setRecording(true);
  
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Microphone access required for recording");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  
  const handleRecordingStop = async () => {
    // Cleanup media resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Process audio if we have chunks
    if (audioChunksRef.current.length > 0) {
      await processAudio();
    }
  };

  const resetState = () => {
    setSourceText("");
    setTranslatedText("");
    setAudioUrl("");
    audioChunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Medical Translation Assistant</h1>
          <p className="text-muted-foreground">Secure real-time translation for healthcare communication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Language Section */}
          <div className="space-y-4">
            <Select 
              value={sourceLanguage} 
              onValueChange={(value) => {
                resetState();
                setSourceLanguage(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Source Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card className="p-6 min-h-[250px] flex flex-col">
              <div className="flex-1 overflow-auto mb-4">
                {sourceText || (isProcessing ? "Processing..." : "Record audio to begin")}
              </div>
              <div className="flex justify-between items-center">
              <Button 
                  variant={recording ? "destructive" : "default"}
                  onClick={recording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {recording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Target Language Section */}
          <div className="space-y-4">
            <Select 
              value={targetLanguage} 
              onValueChange={(value) => {
                resetState();
                setTargetLanguage(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Target Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card className="p-6 min-h-[250px] relative">
              <div className="flex-1 overflow-auto mb-4">
                {translatedText || "Translation will appear here"}
              </div>
              {audioUrl && (
                <div className="flex items-center gap-2 mt-4">
                  <audio 
                    controls 
                    className="w-full"
                    src={audioUrl}  // Use URL directly from backend
                  />
                  
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}