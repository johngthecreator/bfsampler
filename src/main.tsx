import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import { PGlite } from "@electric-sql/pglite"
import { live } from "@electric-sql/pglite/live"
import { PGliteProvider } from "@electric-sql/pglite-react"

import './index.css'
import App from './App.tsx'
import Home from './views/Home.tsx';

const initializeDB = async () => {
  const db = await PGlite.create({
    extensions: { live },
    persistent: true,
    name: 'doppler-db'
  });

  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS doppler_entries (
      id SERIAL PRIMARY KEY,
      session_name TEXT NOT NULL,
      tempo INTEGER NOT NULL,
      measure_queue INTEGER NOT NULL,
      uncut_audio BLOB NOT NULL,
      sound_t1 BLOB,
      sound_t2 BLOB,
      sound_t3 BLOB,
      sound_t4 BLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

const db = await initializeDB();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PGliteProvider db={db}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hi" element={<App />} />
      </Routes>
    </BrowserRouter>
    </PGliteProvider>
  </StrictMode>,

)
