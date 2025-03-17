// db.ts
import Dexie, { type EntityTable } from 'dexie';

interface DopplerSession {
    id: number;
    session_name: string;
    tempo: number;
    measure_queue: number;
    uncut_audio?: Blob | null;
    sound_t1?: Blob | null;
    sound_t2?: Blob | null;
    sound_t3?: Blob | null;
    sound_t4?: Blob | null;
}


const db = new Dexie('doppler-db') as Dexie & {
  doppler: EntityTable<
    DopplerSession,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  doppler: '++id, session_name, tempo, measure_queue, uncut_audio, sound_t1, sound_t2, sound_t3, sound_t4' // primary key "id" (for the runtime!)
});

export type { DopplerSession };
export { db };

// CRUD Operations for sessions 

export const createNewSession = (session_name: string, tempo: number, measure_queue: number) => {
    db.doppler.add({
        session_name,
        tempo,
        measure_queue,
        uncut_audio: null,
        sound_t1: null,
        sound_t2: null,
        sound_t3: null,
        sound_t4: null
    })
}

export const getAllSessions = () => {
    return db.doppler.toArray();
}

export const getSessionById = (session_id: number) => {
    return db.doppler.where('id').equals(session_id).first();
}