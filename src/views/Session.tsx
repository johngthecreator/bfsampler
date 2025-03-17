
import { db } from "@/lib/db"
import MenuBar from "@/components/MenuBar"
import { useLiveQuery } from "dexie-react-hooks"
export default function Session() {
    const sessions = useLiveQuery(() => db.doppler.toArray());
    const createNewSession = (session_name: string, tempo: number, measure_queue: number) => {
        db.doppler.add({
            session_name,
            tempo,
            measure_queue,
            uncut_audio: null,
            sound_t1: null,
            sound_t2: null,
            sound_t3: null,
            sound_t4: null
        }).then((id) => {
            console.log(`Session created with ID: ${id}`);
        }).catch((error) => {
            console.error('Error creating session:', error);
        });
    }

    return (
        <div className="h-dvh w-full flex flex-col justify-center items-center bg-[#FDF7ED] p-5 overflow-y-auto">
            <MenuBar />
            <button onClick={() => createNewSession('John Test', 169, 1)} className="bg-blue-500 text-white p-2 rounded">Create New Session</button>
            <div className="overflow-y-auto">
                {sessions && sessions.map((session) => {
                        return (
                            <div key={session.id}>
                                <p>{session.session_name}</p>
                                <p>{session.tempo}</p>
                                <p>{session.id}</p>
                            </div>
                        )
                    })  
                }
            </div>
        </div>
    )
}