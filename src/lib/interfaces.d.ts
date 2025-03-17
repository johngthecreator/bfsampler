/**
 * TypeScript interface definitions for the doppler-tracker application
 */

/**
 * Represents a session record from the doppler_sessions table
 */
export interface DopplerSession {
  id: number;
  session_name: string;
  tempo: number;
  measure_queue: number;
  uncut_audio: Uint8Array | null;
  sound_t1: Uint8Array | null;
  sound_t2: Uint8Array | null;
  sound_t3: Uint8Array | null;
  sound_t4: Uint8Array | null;
  created_at: string;
}

/**
 * Response structure from database query operations
 */
export interface DBQueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
}