
import { createNewSession, getAllSessions } from "@/lib/db"
import MenuBar from "@/components/MenuBar"
import { useLiveQuery } from "dexie-react-hooks"
import { Link } from "react-router";
export default function Session() {
    const sessions = useLiveQuery(getAllSessions);

    return (
        <div className="h-dvh w-full flex flex-col justify-center items-center bg-[#FDF7ED] p-5 overflow-y-auto">
            <MenuBar />
            <button onClick={() => createNewSession('John Test', 169, 1)} className="bg-blue-500 text-white p-2 rounded">Create New Session</button>
            <div className="overflow-y-auto">
                {sessions && sessions.map((session) => {
                        return (
                            <Link to={`/?id=${session.id}`} key={session.id}>
                                <p>{session.session_name}</p>
                                <p>{session.tempo}</p>
                                <p>{session.id}</p>
                            </Link>
                        )
                    })  
                }
            </div>
        </div>
    )
}