import moment from "moment/moment";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { UserContext } from "../../providers/User";

function PlayerInfo({ roomId }) {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [roomData, setRoomData] = useState({});
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (user) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    listenDocument("Rooms", roomId, (data) => {
      if (data !== undefined) {
        setRoomData(data);
      }
    });
  }, [roomId]);

  if (currentUser) {
    return (
      <div className="absolute shadow-lg bottom-[10px] left-[10px] bg-[white] rounded-lg p-2 w-[260px] text-[#000] player-info">
        <div className="flex items-center justify-center flex-col m-2 border-b-2 border-gray-900">
          <img
            src={currentUser.photo}
            alt="avatar"
            className="w-[100px] h-[100px] rounded-full border-4 p-2 border-gray-800 object-cover"
          />
          <p>{currentUser.username}</p>
          <p>Coin: {currentUser.coin}</p>
        </div>
        <div className="m-2">
          <p>Phòng đang tham gia: {roomId}</p>
          <button
            className="p-2 rounded-lg bg-[var(--primary)] text-white mt-2 hover:opacity-[0.5] transition-all duration-300 ease-linear"
            onClick={() => {
              let newList = roomData.listUser.filter((e) => e.id !== user.id);
              updateField("Rooms", roomId, "listUser", newList);
              updateField("Rooms", roomId, "amountUser", newList.length);
              updateField("Users", user.id, "roomIdJoin", "");
              updateArrayField("Notifications", roomId, "content", {
                author: user,
                text: `Người chơi ${user.username} vừa rời phòng`,
                createdAt: moment().format(),
              });
              navigate("/");
            }}
          >
            Rời phòng
          </button>
        </div>
      </div>
    );
  }
}

export default PlayerInfo;
