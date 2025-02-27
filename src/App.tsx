import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Form from "./components/Form";
import RandomizerForm from "./components/RandomizerForm";

export type Participant = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isRandomizing, setIsRandomizing] = useState<boolean>(false);
  const [animateName, setAnimateName] = useState<string | null>(null);
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const [isOnRandomizeMode, setIsOnRandomizeMode] = useState<boolean>(false);

  const fetchParticipants = () => {
    fetch(`${API_URL}/participants`)
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
        setParticipants(mappedResult);
      })
      .catch((err) => {
        console.log(err.json());
      });
  };

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
        return;
      }
      setAnimateName(
        participants[Math.floor(Math.random() * participants.length)].name,
      );
    }, interval);
  };

  useEffect(() => {
    if (winner !== null) {
      console.log("winner", winner);
      fetch(`${API_URL}/participants`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: winner.uuid,
          status: 0,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [winner]);





  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
      {confettiVisible && <Confetti />}
      <div className="container grid grid-col-2 gap-2 mx-auto max-w-[80rem] p-6">
        {!isOnRandomizeMode ? <Form randomize={randomize} participants={participants} /> :
          <RandomizerForm
            isRandomizing={isRandomizing}
            animateName={animateName}
            fetchParticipants={fetchParticipants}
            setConfettiVisible={setConfettiVisible}
            setIsOnRandomizeMode={setIsOnRandomizeMode}
            winner={winner} />}

      </div>
    </div>
  );
};

export default App;
