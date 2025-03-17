import { useSplitAudio } from "@/hooks";
import MenuBar from "@/components/MenuBar";
import AudioPlayer from "@/components/AudioPlayer";
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { DopplerSession, getSessionById } from "@/lib/db";

export default function Splitter() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const session_id = searchParams.get('id')

    console.log(session_id)
    const session = useLiveQuery(() => getSessionById(Number(session_id))) as DopplerSession;

    useEffect(()=>{
        if(!session_id || !session){
            navigate('/sessions')
        }
    },[navigate, session_id])


    console.log(Math.round(30 / session?.tempo * 1000))
    
  const { samples, isProcessing, error, splitAudio } = useSplitAudio({
    chunkDurationMs: Math.round(30 / session?.tempo * 1000) // optional, defaults to 1000ms
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleAudioFile = async (file: File) => {
    try {
      await splitAudio(file);
      console.log(`Split into ${samples.length} chunks`);
    } catch (err) {
      console.error('Failed to split audio:', err);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleAudioFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleAudioFile(file);
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center bg-[#FDF7ED] pt-5 overflow-y-auto">
      <div className="w-full max-w-md mb-8 px-5">
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".mp3,.m4a"
            onChange={handleFileChange}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-10 h-10 mb-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Drop your audio file here or click to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: MP3, M4A
            </p>
          </label>
        </div>

        {isProcessing && (
          <div className="text-center mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">Processing audio...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">Error: {error.message}</p>
          </div>
        )}

        {samples.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Audio Chunks ({samples.length})</h2>
            <div className="max-h-80 overflow-y-auto">
              {samples.map((sample, index) => (
                <AudioPlayer 
                  key={index} 
                  audioBlob={sample} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
        <MenuBar id={Number(session_id)} />
    </div>
  );
}