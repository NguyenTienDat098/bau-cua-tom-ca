import chicken from "../../imgs/ga.jpeg";
import deer from "../../imgs/nai.jpeg";
import gourd from "../../imgs/bau.jpeg";
import crab from "../../imgs/cua.jpeg";
import crawfish from "../../imgs/tom.jpeg";
import fish from "../../imgs/ca.jpeg";
import { useEffect, useState } from "react";
import { listenDocument } from "../../firebase/util";
import BetPosition from "../BetPosition";
function Table({ roomId }) {
  const [roomData, setRoomData] = useState({});
  const [userInRoom, setUserInRoom] = useState([]);
  const [bets, setBets] = useState([]);
  useEffect(() => {
    listenDocument("Rooms", roomId, (data) => {
      if (data !== undefined) {
        setRoomData(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    listenDocument("Bets", roomId, (data) => {
      if (data !== undefined) {
        setBets(data.userBets);
      }
    });
  }, [roomId]);

  useEffect(() => {
    if (roomData.listUser) {
      setUserInRoom(roomData.listUser);
    }
  }, [roomData]);

  return (
    <div className="absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60%] flex items-center justify-center p-[40px] rounded-full bg-[#6ab04c] shadow-lg table-play">
      {userInRoom.map((e) => {
        if (e.id !== roomData.owner) {
          return (
            <div className="player" key={e.id}>
              <img src={e.photo} alt="player" className="rounded-full" />
            </div>
          );
        }
        return false;
      })}
      <div className="grid grid-cols-3 gap-1">
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "chicken") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={chicken}
            alt="table"
          />
        </div>
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "deer") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={deer}
            alt="table"
          />
        </div>
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "gourd") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={gourd}
            alt="table"
          />
        </div>
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "crab") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={crab}
            alt="table"
          />
        </div>
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "crawfish") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={crawfish}
            alt="table"
          />
        </div>
        <div className="table-item overflow-hidden rounded-lg">
          <div className="absolute top-0 bottom-0 left-0 w-full">
            {bets.length > 0
              ? bets.map((e) => {
                  if (e.nameBet === "fish") {
                    return (
                      <BetPosition
                        betName={e.nameBet}
                        key={e.author.id}
                        userBet={e.author}
                      />
                    );
                  }
                  return false;
                })
              : false}
          </div>
          <img
            className="w-full object-cover scale-[1.2]"
            src={fish}
            alt="table"
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
