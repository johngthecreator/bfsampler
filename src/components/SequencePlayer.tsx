import { DopplerSession } from '@/lib/db';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface ToneSequencePlayerProps {
  sequence1: (string | null)[];
  sequence2: (string | null)[];
  sequence3: (string | null)[];
  sequence4: (string | null)[];
  session: DopplerSession
}

export default function ToneSequencePlayer({ sequence1, sequence2, sequence3, sequence4, session }: ToneSequencePlayerProps) {
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isQueued, setIsQueued] = useState<boolean>(false);
  const samplerRef1 = useRef<Tone.Sampler | null>(null);
  const samplerRef2 = useRef<Tone.Sampler | null>(null);
  const samplerRef3 = useRef<Tone.Sampler | null>(null);
  const samplerRef4 = useRef<Tone.Sampler | null>(null);
  const sequenceRef1 = useRef<Tone.Sequence<string | null> | null>(null);
  const sequenceRef2 = useRef<Tone.Sequence<string | null> | null>(null);
  const sequenceRef3 = useRef<Tone.Sequence<string | null> | null>(null);
  const sequenceRef4 = useRef<Tone.Sequence<string | null> | null>(null);

  // Assuming 'notes' is defined somewhere in your component or imported
  useEffect(() => {
    // Create synth once
    samplerRef1.current = new Tone.Sampler({
      urls: {
        C1: "./hihat.mp3",
    },
    }).toDestination();
    samplerRef2.current = new Tone.Sampler({
      urls: {
        C1: "./clap.mp3",
    },
    }).toDestination();
    samplerRef3.current = new Tone.Sampler({
      urls: {
        C1: "./snare.mp3",
    },
    }).toDestination();
    samplerRef4.current = new Tone.Sampler({
      urls: {
        C1: "kick.mp3",
    },
    }).toDestination();

    // Cleanup function
    return () => {
      if (samplerRef1.current && samplerRef2.current && samplerRef3.current && samplerRef4.current) {
        samplerRef1.current.dispose();
        samplerRef2.current.dispose();
        samplerRef3.current.dispose();
        samplerRef4.current.dispose();
      }
      if (sequenceRef1.current && sequenceRef2.current && sequenceRef3.current && sequenceRef4.current) {
        sequenceRef1.current.dispose();
        sequenceRef2.current.dispose();
        sequenceRef3.current.dispose();
        sequenceRef4.current.dispose();
      }
    };
  }, []);

  const createSequence1 = (): void => {
    if (sequenceRef1.current) {
      sequenceRef1.current.dispose();
    }
    sequenceRef1.current = new Tone.Sequence<string | null>((time, note) => {
      if (samplerRef1.current) {
        samplerRef1.current.triggerAttackRelease(note || "", '8n', time);
      }
    }, sequence1, '8n');
  };

  const createSequence2 = (): void => {
    if (sequenceRef2.current) {
      sequenceRef2.current.dispose();
    }
    sequenceRef2.current = new Tone.Sequence<string | null>((time, note) => {
      if (samplerRef2.current) {
        samplerRef2.current.triggerAttackRelease(note || "", '8n', time);
      }
    }, sequence2, '8n');
  };

  const createSequence3 = (): void => {
    if (sequenceRef3.current) {
      sequenceRef3.current.dispose();
    }
    sequenceRef3.current = new Tone.Sequence<string | null>((time, note) => {
      if (samplerRef3.current) {
        samplerRef3.current.triggerAttackRelease(note || "", '8n', time);
      }
    }, sequence3, '8n');
  };

  const createSequence4 = (): void => {
    if (sequenceRef4.current) {
      sequenceRef4.current.dispose();
    }
    sequenceRef4.current = new Tone.Sequence<string | null>((time, note) => {
      if (samplerRef4.current) {
        samplerRef4.current.triggerAttackRelease(note || "", '8n', time);
      }
    }, sequence4, '8n');
  };


  const queueNextTrack = () => {
      if (sequenceRef1.current && sequenceRef2.current && sequenceRef3.current && sequenceRef4.current) {
        setIsQueued(false);
        createSequence1(); // Recreate sequence before playing
        createSequence2(); // Recreate sequence before playing
        createSequence3(); // Recreate sequence before playing
        createSequence4(); // Recreate sequence before playing 
        sequenceRef1.current.start(0);
        sequenceRef2.current.start(0);
        sequenceRef3.current.start(0);
        sequenceRef4.current.start(0);
      }
  }

  const scheduleNextTrack = () => {
    if (sequenceRef1.current) {
      setIsQueued(true);
      const transport = Tone.getTransport();
      const timeSignature = transport.timeSignature;
      const bpm = transport.bpm.value;
  
      // Calculate measure length in seconds
      const secondsPerMeasure = (timeSignature as number / (bpm / 60)) * (4 / (timeSignature as number));
  
      // Calculate the total delay in seconds
      const delayInSeconds = session.measure_queue * secondsPerMeasure;
  
      // Schedule the next track using setTimeout
      setTimeout(queueNextTrack, delayInSeconds * 1000); // Convert to milliseconds
    } else {
      console.error("Sequence 1 ref is not available.");
    }
  };

  const handlePlayStop = async (): Promise<void> => {
    try {
      if (!isPlaying) {
        await Tone.start();
        createSequence1(); // Recreate sequence before playing
        createSequence2(); // Recreate sequence before playing
        createSequence3(); // Recreate sequence before playing
        createSequence4(); // Recreate sequence before playing
        Tone.getTransport().start();
        Tone.getTransport().bpm.value = session.tempo;
        if (sequenceRef2.current && sequenceRef1.current && sequenceRef3.current && sequenceRef4.current) {
          sequenceRef1.current.start();
          sequenceRef2.current.start();
          sequenceRef3.current.start();
          sequenceRef4.current.start();
        }
      } else {
        Tone.getTransport().stop();
        if (sequenceRef1.current && sequenceRef2.current && sequenceRef3.current && sequenceRef4.current) {
          sequenceRef1.current.stop();
          sequenceRef2.current.stop();
          sequenceRef3.current.stop();
          sequenceRef4.current.stop();
          sequenceRef1.current.dispose();
          sequenceRef2.current.dispose();
          sequenceRef3.current.dispose();
          sequenceRef4.current.dispose();
          console.log("Sequence stopped and disposed");
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error in handlePlayStop:", error);
    }
  };

  return (
    <>
    <button
        onClick={handlePlayStop}
        className={`w-20 md:w-full flex-grow p-3 ${ isPlaying ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'} outline-1 outline-black`}
    >
        {isPlaying ? 'Stop' : 'Play'}
    </button>
    <button
        onClick={scheduleNextTrack}
        className={`w-20 md:w-full flex-grow p-3 ${ isQueued ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'} outline-1 outline-black text-center`}
        disabled={isQueued}
    >
      {isQueued ? "Locked" :"Queue"}
    </button>
    </>
  );
}
