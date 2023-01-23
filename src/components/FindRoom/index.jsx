import { faMagnifyingGlass, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addDocument,
  getMutipleDocuments,
  getSimpleDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { NotificationContext } from "../../providers/Notification";
import { UserContext } from "../../providers/User";
import { CheckSpacing } from "../FormValid";

function FindRoom() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [roomId, setRoomId] = useState("");
  const [roomIdCreated, setRoomIdCreated] = useState("");
  const [roomsResponse, setRoomsResponse] = useState([]);
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;
  const createRoomRef = useRef();
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center">
        <div
          className="create-room absolute shadow-lg top-[50%] left-[50%] translate-x-[-300%] translate-y-[-50%] bg-white rounded-lg p-4 flex flex-col items-center"
          ref={createRoomRef}
        >
          <div className="">
            <label htmlFor="id-room">ID phòng</label>
            <input
              type="text"
              id="id-room"
              value={roomIdCreated}
              onChange={(e) => {
                setRoomIdCreated(e.target.value);
              }}
              placeholder="Nhập vào id phòng bạn muốn tạo"
              className="outline-none border-none rounded-lg p-2 mr-2 text-black min-w-[300px]"
            />
          </div>
          <div>
            <button
              className="m-1 p-2 bg-[var(--primary)] rounded-lg w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear"
              onClick={async () => {
                if (CheckSpacing(roomIdCreated)) {
                  const checkExists = await getSimpleDocument(
                    "Rooms",
                    roomIdCreated
                  );
                  if (checkExists === -1) {
                    const dataRoom = {
                      roomId: roomIdCreated,
                      owner: user.id,
                      listUser: [user],
                      amountUser: 0,
                      maxUser: 5,
                      statusBet: "",
                    };
                    const dataMessage = {
                      roomId: roomIdCreated,
                      content: [],
                    };
                    addDocument("Rooms", roomIdCreated, dataRoom);
                    addDocument("Messages", roomIdCreated, dataMessage);
                    setNotifiInfo({
                      active: true,
                      title: "Thành công",
                      message: "Tạo phòng thành công",
                      type: "success",
                    });
                    createRoomRef.current.classList.remove("active");
                    updateField("Users", user.id, "roomIdJoin", roomIdCreated);
                    navigate("/room/" + roomIdCreated);
                  } else {
                    setNotifiInfo({
                      active: true,
                      title: "Lỗi",
                      message: "ID phòng đã tồn tại !!!",
                      type: "danger",
                    });
                  }
                } else {
                  setNotifiInfo({
                    active: true,
                    title: "Lỗi",
                    message: "ID phòng không hợp lệ !!!",
                    type: "danger",
                  });
                }
                setRoomIdCreated("");
              }}
            >
              Tạo
            </button>
            <button
              className="m-1 p-2 bg-[var(--second)] rounded-lg w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear"
              onClick={() => {
                createRoomRef.current.classList.remove("active");
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
        <div className="mb-4 mt-2">
          <input
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            type="text"
            className="outline-none border-none rounded-lg p-2 mr-2 text-black"
            placeholder="Nhập vào id phòng"
          />
          <button
            className="p-2 bg-[var(--primary)] rounded-lg w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear"
            onClick={() => {
              getMutipleDocuments("Rooms", "roomId", "==", roomId)
                .then((res) => {
                  setRoomsResponse(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <button
            className="p-2 bg-[var(--primary)] rounded-lg m-w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear ml-2"
            onClick={() => {
              createRoomRef.current.classList.add("active");
            }}
          >
            Tạo phòng
          </button>
        </div>
        <div>
          <p className="text-center">Danh sách các phòng</p>
          <ul className="mt-2">
            {roomsResponse.length > 0 && roomId !== " " ? (
              roomsResponse.map((e, i) => {
                return (
                  <Link to={"/room/" + e.roomId} key={e.roomId}>
                    <li
                      className="flex items-center justify-between p-2 bg-[var(--primary)] rounded-lg cursor-pointer hover:opacity-[0.5] transition-all duration-200 ease-linear w-[260px]"
                      onClick={() => {
                        let exists = false;
                        e.listUser.forEach((element) => {
                          if (element.id === user.id) {
                            exists = true;
                          }
                        });
                        if (!exists) {
                          updateArrayField("Rooms", e.roomId, "listUser", user);
                          updateField(
                            "Rooms",
                            e.roomId,
                            "amountUser",
                            e.amountUser + 1
                          );
                          updateField("Users", user.id, "roomIdJoin", e.roomId);
                        }
                      }}
                    >
                      <p>{e.roomId}</p>
                      <p>
                        {e.amountUser}/{e.maxUser}
                        <FontAwesomeIcon icon={faUsers} className="ml-2" />
                      </p>
                    </li>
                  </Link>
                );
              })
            ) : (
              <>
                <p>Không tìm thấy ID phòng trên</p>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default FindRoom;
