import { db } from '@/lib/db';
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  audioBlob: Blob;
  index?: number;
  sessionId?: number;
}

export default function AudioPlayer({ audioBlob, index, sessionId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    // Create object URL when component mounts
    const url = URL.createObjectURL(audioBlob);
    setObjectUrl(url);
    
    // Clean up object URL when component unmounts
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioBlob]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTrackTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrackType = e.target.value;
    setSelectedTrack(newTrackType);
    
    if (sessionId) {
      try {
        // Simply update the session with the new track assignment
        await db.doppler.update(sessionId, { 
          [newTrackType]: audioBlob 
        });
        
        // Notify parent component
      } catch (error) {
        console.error("Failed to update track type:", error);
      }
    }
  };
  
  return (
    <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 my-1">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      
      <div className="ml-3">
        <p className="text-sm font-medium">Chunk {index !== undefined ? index + 1 : ''}</p>
        <audio 
          ref={audioRef}
          src={objectUrl || undefined} 
          onEnded={handleAudioEnded}
          className="hidden"
        />
      </div>
      <div className="ml-auto">
          <select 
            value={selectedTrack}
            onChange={handleTrackTypeChange}
            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="" disabled>Assign to</option>
            <option value="sound_t1">T1</option>
            <option value="sound_t2">T2</option>
            <option value="sound_t3">T3</option>
            <option value="sound_t4">T4</option>
          </select>
        </div>
    </div>
  );
}