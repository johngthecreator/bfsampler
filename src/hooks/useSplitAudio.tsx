import { useState } from 'react';
import { audioBufferToWav } from '../lib/split';

interface UseSplitAudioOptions {
  chunkDurationMs?: number;
}

export const useSplitAudio = ({ chunkDurationMs = 1000 }: UseSplitAudioOptions = {}) => {
  const [samples, setSamples] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const splitAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const audioBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioData = await audioContext.decodeAudioData(audioBuffer);
      
      const sampleRate = audioData.sampleRate;
      const samplesPerChunk = (sampleRate * chunkDurationMs) / 1000;
      const numberOfChannels = audioData.numberOfChannels;
      
      const chunks: Blob[] = [];
      
      for (let offset = 0; offset < audioData.length; offset += samplesPerChunk) {
        const chunkBuffer = audioContext.createBuffer(
          numberOfChannels,
          Math.min(samplesPerChunk, audioData.length - offset),
          sampleRate
        );
        
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const channelData = audioData.getChannelData(channel);
          const chunkChannelData = chunkBuffer.getChannelData(channel);
          
          chunkChannelData.set(
            channelData.slice(offset, offset + samplesPerChunk)
          );
        }
        
        const wavBlob = await audioBufferToWav(chunkBuffer);
        chunks.push(wavBlob);
      }
      
      setSamples(chunks);
      return chunks;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to split audio');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    samples,
    isProcessing,
    error,
    splitAudio
  };
};