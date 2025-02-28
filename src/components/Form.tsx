import React
, { useRef, useState } from "react";

import { type Participant } from "../App";
import { addParticipant, removeParticipant } from "../indexdb/indexdb";

interface FormProps {
    participants: Participant[];
    randomize: any;
    // addParticipantState: any;
    fetchParticipants: any;
    openModal: any;
}
const Form: React.FC<FormProps> = ({ participants, randomize, fetchParticipants, openModal }) => {

    const inputRef = useRef(null);
    const removeDebounceRef = useRef(false);

    const [error, setError] = useState("");



    return (
        <React.Fragment>
            <div className="flex gap-2 w-full items-center bg-transparent justify-center">
                <div className="flex flex-col w-full max-w-lg h-52 text-center">
                    <input
                        ref={inputRef}
                        type="text"
                        id="first_name"
                        className={`w-full bg-transparent text-black text-5xl text-center justify-center align-middle focus:outline-none placeholder-black
                        ${error ? "text-red-500" : ""}`}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // Prevent form submission if inside a form
                                const name = e.target.value.trim();

                                // ✅ Check if name already exists
                                if (participants.includes(name)) {
                                    setError("Names must be unique");
                                    return;
                                }
                                try {
                                    await addParticipant(name);
                                    // addParticipantState(name);
                                    fetchParticipants();
                                    setError(""); // ✅ Clear error on success
                                    inputRef.current.value = ""; // ✅ Clear input field
                                } catch (err) {
                                    console.error("Error adding participant:", err);
                                    setError("Names must be unique");
                                }
                            }
                        }}
                        placeholder="Enter your name"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="card bg-opacity-50 bg-white/30 backdrop-blur-md shadow-xl border border-white/20 max-w-[15rem]">
                    <div className="card-body items-left text-center">
                        <h1 className="text-white/60 font-light text-md">Participants</h1>
                        <h3 className="text-black/70 font-bold text-2xl">
                            {participants.length}
                        </h3>
                    </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex gap-2 items-center justify-center">
                    {/* <button className="btn btn-success mt-20" onClick={downloadCSV}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 3v5h5M8 13h8M8 17h8M8 9h2"
                />
              </svg>
              Download Attendance
            </button> */}

                    <button className="btn mt-20" onClick={openModal}>
                        View Winners
                    </button>
                    <button className="btn mt-20" onClick={randomize}>
                        Randomize
                    </button>
                </div>
            </div>

            <div className="card h-[500px] overflow-y-auto bg-opacity-50 bg-white/30 backdrop-blur-md shadow-xl border border-white/20">
                <div className="card-body overflow-x-auto items-left text-center">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className="text-black/70 text-2xl">
                                <th></th>
                                <th>Participants</th>
                                {/* <th>Email</th>
                                <th>Date</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant, index) => (
                                <tr
                                    className="text-black/60 text-xl group hover:bg-gray-100 transition duration-200"
                                    key={`${participant.id}-${participant.name}`}
                                >
                                    <th className="px-4 py-2">{participants.length - index}</th>
                                    <td className="px-4 py-2">{participant.name}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button
                                            onDoubleClick={async () => {
                                                try {

                                                    if (removeDebounceRef.current) return;
                                                    removeDebounceRef.current = true;
                                                    await removeParticipant(participant);
                                                    fetchParticipants();
                                                    removeDebounceRef.current = false;
                                                } catch (err) {
                                                    console.error("Error removing participant:", err);
                                                    removeDebounceRef.current = false;
                                                }
                                                removeParticipant(participant)
                                            }}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition duration-200"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Form;