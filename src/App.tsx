import React, { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import Form from "./components/Form";
import RandomizerForm from "./components/RandomizerForm";
import WinnersModal from "./components/WinnersModal.js"
import { addWinner, getAllParticipants, hideParticipant, removeParticipant } from "./indexdb/indexdb.js"

export type Participant = {
  id: number;
  name: string;

};

const API_URL = import.meta.env.VITE_API_URL;



const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isRandomizing, setIsRandomizing] = useState<boolean>(false);
  const [animateName, setAnimateName] = useState<string | null>(null);
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const [isOnRandomizeMode, setIsOnRandomizeMode] = useState<boolean>(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);


  const downloadCSV = () => {
    fetch(`${API_URL}/participants/all`)
      .then((res) => res.json())
      .then((data) => {
        const mappedResult = data.map((participant: any, index: number) => ({
          ...participant,
          id: index + 1,
          uuid: participant.id,
          created_at: new Date(participant.created_at).toLocaleString("en-US", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        }));
        const headers = ["Name", "Email", "Date Registered"];
        const rows = mappedResult.map(
          ({
            name,
            email,
            created_at,
          }: {
            name: string;
            email: string;
            created_at: string;
          }) => [name, email, created_at],
        );

        const csvContent = [
          headers.join(","), // Add header row
          ...rows.map((row: string[]) => row.join(",")), // Add each data row
        ].join("\n");

        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);

        // Create a download link and click it to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "participants.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(url); // Free up memory
      })
      .catch((err) => {
        console.log(err.json());
      });

    if (participants.length > 0) {
    }
  };

  const addParticipantState = (participant: string) => {
    setParticipants((prevItems) => [{ name: participant, id: prevItems.length + 1 }, ...prevItems]);
  };


  const fetchParticipants = useCallback(() => {
    getAllParticipants()
      .then((data: any) => {

        console.log('data: ', data)
        let participants;
        if (data?.length) {
          participants = data?.length && data.reverse().filter((participant: any, index: number) => (!participant.is_hidden))
        }
        setParticipants(participants ?? []);
      })
    // .then((data) => {
    //   const mappedResult = data.map((participant: any, index: number) => ({
    //     ...participant,
    //     id: index + 1,
    //     uuid: participant.id,
    //     created_at: new Date(participant.created_at).toLocaleString("en-US", {
    //       timeZone: "Asia/Manila",
    //       year: "numeric",
    //       month: "long",
    //       day: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //       second: "2-digit",
    //       hour12: true,
    //     }),
    //   }));
    //   setParticipants(mappedResult);
    // })
    // .catch((err) => {
    //   console.log(err.json());
    // });
  }, []);

  useEffect(() => {

    fetchParticipants();
  }, []);

  const randomize = () => {
    if (participants.length === 0) return;

    setIsOnRandomizeMode(true);
    setIsRandomizing(true);
    setWinner(null);
    setConfettiVisible(false);

    // Animate names for 3 seconds
    const duration = 3000;
    const interval = 150;
    const endTime = Date.now() + duration;

    const randomizeInterval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(randomizeInterval);
        const selectedWinner =
          participants[Math.floor(Math.random() * participants.length)];
        setWinner(selectedWinner);
        setConfettiVisible(true);
        setIsRandomizing(false);
        setAnimateName(null);
        handleWinner(selectedWinner);

        return;
      }
      setAnimateName(
        participants[Math.floor(Math.random() * participants.length)].name,
      );
    }, interval);
  };

  const handleWinner = async (winner: Participant) => {
    const hide = await hideParticipant(winner.id)
    fetchParticipants();
    const add = await addWinner({
      ...winner, date: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    })

  }

  useEffect(() => {
    if (winner !== null) {
      console.log("winner", winner);
    }
  }, [winner]);





  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
      {confettiVisible && <Confetti />}
      <div className="container grid grid-col-2 gap-2 mx-auto max-w-[80rem] p-6">
          {!isOnRandomizeMode ? <Form openModal={openModal} randomize={randomize} participants={participants} fetchParticipants={fetchParticipants} /> :
          <RandomizerForm
            isRandomizing={isRandomizing}
            animateName={animateName}
            fetchParticipants={fetchParticipants}
            setConfettiVisible={setConfettiVisible}
            setIsOnRandomizeMode={setIsOnRandomizeMode}
            winner={winner} />}

      </div>
    </div>
      <WinnersModal
        isOpen={isModalOpen}
        onClose={closeModal}
        participants={participants}
        removeParticipant={removeParticipant}
        fetchParticipants={fetchParticipants}
      />
    </>
  );
};

export default App;
