import React
    from "react";

import { type Participant } from "../App";

interface FormProps {
    participants: Participant[];
    randomize: any;
}
const Form: React.FC<FormProps> = ({ participants, randomize }) => {
    return (
        <React.Fragment>
            <div className="flex gap-2 w-full h-50 bg-transparent">
                <div className="w-full">
                    <input type="text" id="first_name" className=" border bg-transparent border-gray-300 w-full text-gray-900 text-sm rounded-lg block p-2.5 " placeholder="Enter your name" required />
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
                    <button className="btn mt-20" onClick={randomize}>
                        Randomize
                    </button>
                </div>
            </div>

            <div className="card bg-opacity-50 bg-white/30 backdrop-blur-md shadow-xl border border-white/20">
                <div className="card-body overflow-x-auto items-left text-center">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className="text-black/70 text-2xl">
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant) => (
                                <tr className="text-black/60 text-xl" key={participant.id}>
                                    <React.Fragment>
                                        <th>{participant.id}</th>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.created_at}</td>
                                    </React.Fragment>
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