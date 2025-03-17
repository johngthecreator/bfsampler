

// Helper to convert AudioBuffer to WAV blob
export const audioBufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const wavData = new DataView(new ArrayBuffer(44 + length));
    
    // WAV header
    writeString(wavData, 0, 'RIFF');
    wavData.setUint32(4, 36 + length, true);
    writeString(wavData, 8, 'WAVE');
    writeString(wavData, 12, 'fmt ');
    wavData.setUint32(16, 16, true);
    wavData.setUint16(20, 1, true);
    wavData.setUint16(22, numberOfChannels, true);
    wavData.setUint32(24, buffer.sampleRate, true);
    wavData.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
    wavData.setUint16(32, numberOfChannels * 2, true);
    wavData.setUint16(34, 16, true);
    writeString(wavData, 36, 'data');
    wavData.setUint32(40, length, true);
    
    // Write audio data
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            wavData.setInt16(offset + (i * numberOfChannels + channel) * 2, sample * 0x7FFF, true);
        }
    }
    
    return new Blob([wavData], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};
