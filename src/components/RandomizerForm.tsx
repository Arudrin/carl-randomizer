import React from "react";
import { Participant } from "../App";


interface RandomizerProps {
  isRandomizing: boolean,
  animateName: string | null,
  winner: Participant | null,
  setConfettiVisible: () => {},
  setIsOnRandomizeMode: () => {},
  fetchParticipants: () => void
}
const RandomizerForm: React.FC<RandomizerProps> = ({
  isRandomizing,
  animateName,
  winner,
  setConfettiVisible,
  setIsOnRandomizeMode,
  fetchParticipants
}) => {

  return (
    <React.Fragment>
      <div className="card flex-1">
        <div className="card-body items-center text-center">
          <div className="h-64">
            {isRandomizing ? (
              <h3 className="text-white text-6xl animate-pulse">
                {animateName}
              </h3>
            ) : (
              winner && (
                <React.Fragment>
                  <h4 className="text-xl text-white/50 mb-6">
                    Congratulations
                  </h4>
                  <h3 className="text-6xl font-bold text-black/70 animate-heartbeat">
                    {winner.name}
                  </h3>
                </React.Fragment>
              )
            )}
            {winner && (
              <div className="mt-14">
                <button
                  className="btn btn-md w-80"
                  onClick={() => {
                    setConfettiVisible(false);
                    setIsOnRandomizeMode(false);
                    fetchParticipants();
                  }}
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RandomizerForm;