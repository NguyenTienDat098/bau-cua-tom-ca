import chicken from "../../imgs/ga.jpeg";
import deer from "../../imgs/nai.jpeg";
import gourd from "../../imgs/bau.jpeg";
import crab from "../../imgs/cua.jpeg";
import crawfish from "../../imgs/tom.jpeg";
import fish from "../../imgs/ca.jpeg";
import { useEffect, useState } from "react";
import { listenDocument } from "../../firebase/util";
function Table({ roomId }) {
  const [roomData, setRoomData] = useState({});
  const [userInRoom, setUserInRoom] = useState([]);

  useEffect(() => {
    listenDocument("Rooms", roomId, (data) => {
      if (data !== undefined) {
        setRoomData(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    if (roomData.listUser) {
      setUserInRoom(roomData.listUser);
    }
  }, [roomData]);

  return (
    <div className="absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60%] flex items-center justify-center p-[40px] rounded-full bg-[#6ab04c] shadow-lg">
      {userInRoom.map((e) => {
        if (e.id !== roomData.owner) {
          return (
            <div className="player" key={e.id}>
              <img src={e.photo} alt="player" />
            </div>
          );
        }
        return false;
      })}
      <div className="grid grid-cols-3 gap-1">
        <div className="table-item">
          <img src={chicken} alt="table" />
        </div>
        <div className="table-item">
          <img src={deer} alt="table" />
        </div>
        <div className="table-item">
          <img src={gourd} alt="table" />
        </div>
        <div className="table-item">
          <img src={crab} alt="table" />
        </div>
        <div className="table-item">
          <img src={crawfish} alt="table" />
        </div>
        <div className="table-item">
          <img src={fish} alt="table" />
        </div>
      </div>
    </div>
  );
}

export default Table;
