import MenuBar from "@/components/MenuBar";
import ToneSequencePlayer from "@/components/SequencePlayer";
import { useEffect, useReducer, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams, useNavigate } from "react-router";
import { DopplerSession, getSessionById } from "@/lib/db";

export default function Home(){
    const [octave, setOctave] = useState<number>(4)
    const [currTrack, setCurrTrack] = useState<string>('T1')
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tracks = {
        "T1":{"sequence":[null,null,null,null,null,null,null,null],"active":[null,null,null,null,null,null,null,null]},
        "T2":{"sequence":[null,null,null,null,null,null,null,null],"active":[null,null,null,null,null,null,null,null]},
        "T3":{"sequence":[null,null,null,null,null,null,null,null],"active":[null,null,null,null,null,null,null,null]},
        "T4":{"sequence":[null,null,null,null,null,null,null,null],"active":[null,null,null,null,null,null,null,null]},
    }

    const session_id = searchParams.get('id')

    useEffect(()=>{
        if(!session_id){
            navigate('/sessions')
        }
    },[navigate, session_id])

    const session = useLiveQuery(() => getSessionById(Number(session_id))) as DopplerSession;

    const iterateOctave = () => {
        if(octave < 9){
            setOctave(octave + 1)
        }else{
            setOctave(1)
        }
    }

    // any for now
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const reducer = (state: any, action: any) => {
        switch (action.type) {
          case 'UPDATE': {
            const track = action.payload.track;
            const sequenceIndex = action.payload.sequenceIndex;
            const note = action.payload.note;
            const noteId = action.payload.noteId;

            return {
                ...state,
                [track]: {
                    ...state[track],
                    sequence: state[track].sequence.map((item: any, index: any) =>
                        index === sequenceIndex ? note : item
                    ),
                    active: state[track].active.map((item: any, index: any) =>
                        index === sequenceIndex ? noteId : item
                    )
                }
            };
          }
          default:
            return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, tracks)
    const noteGrid = ["C", "D", "E", "F", "G", "A", "B"].reverse();
    const updateNote = (sequenceIndex: number, note: string | null, noteId: string | null ) => {
        dispatch({type:'UPDATE', payload:{track: currTrack, sequenceIndex: sequenceIndex, note:note, noteId: noteId}})
    }

    return(
        <div className="h-dvh w-full flex flex-col justify-center items-center bg-[#FDF7ED] pt-5 overflow-y-auto">
            <div className="w-full h-full flex flex-col gap-5 md:flex-row px-5">
                <div className="flex-1 w-full flex flex-row md:flex-col gap-3">
                    <button
                        onClick={() => setCurrTrack("T1")}
                        className={`w-full flex-grow p-2.5 ${ currTrack == "T1" ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'} outline-1 outline-black`}
                    >
                        T1
                    </button>
                    <button
                        onClick={() => setCurrTrack("T2")}
                        className={`w-full flex-grow p-2.5 ${ currTrack == "T2" ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'}  outline-1 outline-black`}
                    >
                        T2
                    </button>
                    <button
                        onClick={() => setCurrTrack("T3")}
                        className={`w-full flex-grow p-2.5 ${ currTrack == "T3" ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'} outline-1 outline-black`}
                    >
                        T3
                    </button>
                    <button
                        onClick={() => setCurrTrack("T4")}
                        className={`w-full flex-grow p-2.5 ${ currTrack == "T4" ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black'} outline-1 outline-black`}
                    >
                        T4
                    </button>
                    <div className="grid grid-rows-3 gap-3 md:w-full">
                    <button
                        onClick={iterateOctave}
                        className={`w-20 md:w-full p-3 bg-[#FDF7ED] text-black outline-1 outline-black`}
                    >
                        OCT {octave}
                    </button>
                    <ToneSequencePlayer sequence1={state['T1'].sequence} sequence2={state['T2'].sequence} sequence3={state['T3'].sequence} sequence4={state['T4'].sequence} session={session} />

                    </div>
                </div>

                <div className="grid grid-cols-8 gap-2">
                    {noteGrid.map((note)=>{
                        const multiNotes = Array(8).fill(note);
                        return multiNotes.map((dupeNote, index)=>{
                            const isActive = state[currTrack]?.active?.includes(`${dupeNote}-${index}`)
                            return(
                                <button key={`${dupeNote}-${index}`} id={`${dupeNote}-${index}`} onClick={()=>updateNote(index, isActive ? null : `${dupeNote}${octave}`, isActive ? null : `${dupeNote}-${index}`)} className={`h-full aspect-square flex flex-col justify-center items-center rounded-full ${isActive ? 'bg-black text-white' : 'bg-[#FDF7ED] text-black outline-1 outline-black' }  p-2 text-center`}>
                                </button>
                            )
                        })
                    })}
                </div>
            </div>
            <MenuBar id={Number(session_id)} />
        </div>
    )
}