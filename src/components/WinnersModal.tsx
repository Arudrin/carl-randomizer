import React, { useEffect, useState } from "react";
import { getAllWinners, returnParticipantToPool, removeWinner } from "../indexdb/indexdb";

const WinnersModal = ({ isOpen, onClose, participants, removeParticipant, fetchParticipants }) => {

    const [winners, setWinners] = useState([]);
    useEffect(() => {
        if (isOpen) {
            getAllWinners().then((data) => {
                console.log('winners: ', data)
                if (data?.length > 0) {

                    setWinners(data.reverse());
                }
            })
        }
    }, [isOpen])

    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
            <div className="card bg-opacity-50 h-[600px] bg-white/30 backdrop-blur-md shadow-xl border border-white/20 w-[90%] max-w-2xl p-4 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
                >
                    ✕
                </button>

                <div className="card-body overflow-x-auto text-center">
                    <table className="table w-full">
                        {/* Table Head */}
                        <thead>
                            <tr className="text-black/70 text-2xl">
                                <th></th>
                                <th>Winners</th>
                                <th>Win Date</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {winners?.length ? winners.map((winner, index) => (
                                <tr
                                    className="text-black/60 text-xl group hover:bg-gray-100 transition duration-200"
                                    key={`${winner.id}-${winner.name}`}
                                >
                                    <td className="px-4 py-2">{winners.length - index}</td>
                                    <td className="px-4 py-2">{winner.name}</td>
                                    <td className="px-4 py-2">{winner.win_date}</td>
                                    <td className="px-2 py-2">
                                        {/* Remove Participant on Double Click */}
                                        <button
                                            onDoubleClick={async () => {
                                                try {
                                                    await returnParticipantToPool(winner.participant_id);
                                                    fetchParticipants();

                                                } catch (err) {
                                                    console.error("Error returning participant:", err);
                                                }
                                            }}
                                            className="text-green-500 opacity-0 group-hover:opacity-100 transition duration-200"
                                        >
                                            {'<-'}
                                        </button>
                                    </td>
                                    <td className="px-2 py-2">
                                        {/* Remove Participant on Double Click */}
                                        <button
                                            onDoubleClick={async () => {
                                                try {
                                                    await removeWinner(winner.id);
                                                    getAllWinners().then((data) => {
                                                        console.log('winners: ', data)
                                                        if (data?.length > 0) {

                                                            setWinners(data.reverse());
                                                        }
                                                    });

                                                } catch (err) {
                                                    getAllWinners().then((data) => {
                                                        console.log('winners: ', data)
                                                        if (data?.length > 0) {

                                                            setWinners(data.reverse());
                                                        }
                                                    });
                                                    console.error("Error removing winner:", err);
                                                }
                                            }}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition duration-200"
                                        >
                                            {'x'}
                                        </button>
                                    </td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WinnersModal;
