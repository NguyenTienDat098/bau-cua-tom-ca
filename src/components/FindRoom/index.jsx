import {
  faMagnifyingGlass,
  faRightFromBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import {
  addDocument,
  getMutipleDocuments,
  getSimpleDocument,
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { NotificationContext } from "../../providers/Notification";
import { UserContext } from "../../providers/User";
import { CheckSpacing } from "../FormValid";

function FindRoom() {
  const UserData = useContext(UserContext);
  const { user, logout } = UserData;
  const [roomId, setRoomId] = useState("");
  const [roomIdCreated, setRoomIdCreated] = useState("");
  const [roomsResponse, setRoomsResponse] = useState([]);
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;
  const createRoomRef = useRef();
  const navigate = useNavigate();
  const [currentUser, setCurentUser] = useState(user);
  const [roomData, setRoomData] = useState(null);

  const hasNetwork = useCallback(
    (online) => {
      if (user) {
        updateField("Users", user.id, "online", online);
      }
    },
    [user]
  );
  useEffect(() => {
    const handleCheckOnline = () => {
      if (user && user.uid) {
        hasNetwork(navigator.onLine);
        window.addEventListener("online", () => {
          hasNetwork(true);
        });
        window.addEventListener("offline", () => {
          hasNetwork(false);
        });
      }
    };
    window.addEventListener("load", handleCheckOnline);
    return () => {
      window.removeEventListener("load", handleCheckOnline);
    };
  }, [user, hasNetwork]);

  // set active use false when leave the page
  useEffect(() => {
    window.onbeforeunload = () => {
      hasNetwork(false);
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, [hasNetwork]);

  useEffect(() => {
    if (roomId !== "") {
      listenDocument("Rooms", roomId, (data) => {
        if (data !== undefined) {
          setRoomData(data);
        }
      });
    }
  }, [roomId]);

  useEffect(() => {
    if (user) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurentUser(data);
        }
      });
    }
  }, [roomId, user]);

  useEffect(() => {
    if (currentUser.roomIdJoin !== "") {
      navigate("/room/" + currentUser.roomIdJoin);
    }
  }, [currentUser, navigate]);

  return (
    <>
      <div
        className="absolute top-[10px] right-[10px] bg-white text-black p-2 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={() => {
          logout();
        }}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </div>
      <div className="w-full h-screen flex flex-col items-center">
        {currentUser.createRoom ? (
          <div
            className="create-room absolute shadow-lg top-[50%] left-[50%] translate-x-[-300%] translate-y-[-50%] bg-white rounded-lg p-4 flex flex-col items-center"
            ref={createRoomRef}
          >
            <div className="">
              <label htmlFor="id-room">ID ph??ng</label>
              <input
                type="text"
                id="id-room"
                value={roomIdCreated}
                onChange={(e) => {
                  setRoomIdCreated(e.target.value);
                }}
                placeholder="Nh???p v??o id ph??ng b???n mu???n t???o"
                className="outline-none border-none rounded-lg p-2 mr-2 text-black min-w-[300px]"
              />
            </div>
            <div>
              <button
                className="m-1 p-2 bg-[var(--primary)] rounded-lg w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear"
                onClick={async () => {
                  if (CheckSpacing(roomIdCreated) && currentUser.createRoom) {
                    const checkExists = await getSimpleDocument(
                      "Rooms",
                      roomIdCreated
                    );
                    if (checkExists === -1) {
                      const dataRoom = {
                        roomId: roomIdCreated,
                        owner: user.id,
                        listUser: [user],
                        amountUser: 1,
                        maxUser: 5,
                        statusBet: "",
                      };
                      const dataMessage = {
                        roomId: roomIdCreated,
                        content: [],
                      };
                      const dataNotification = {
                        roomId: roomIdCreated,
                        content: [],
                      };
                      const dataBet = {
                        firstResult: "",
                        secondResult: "",
                        thirdResult: "",
                        userBets: [],
                      };
                      addDocument("Rooms", roomIdCreated, dataRoom);
                      addDocument("Messages", roomIdCreated, dataMessage);
                      addDocument(
                        "Notifications",
                        roomIdCreated,
                        dataNotification
                      );
                      addDocument("Bets", roomIdCreated, dataBet);
                      setNotifiInfo({
                        active: true,
                        title: "Th??nh c??ng",
                        message: "T???o ph??ng th??nh c??ng",
                        type: "success",
                      });
                      createRoomRef.current.classList.remove("active");
                      updateField(
                        "Users",
                        user.id,
                        "roomIdJoin",
                        roomIdCreated
                      );
                      navigate("/room/" + roomIdCreated);
                    } else {
                      setNotifiInfo({
                        active: true,
                        title: "L???i",
                        message: "ID ph??ng ???? t???n t???i !!!",
                        type: "danger",
                      });
                    }
                  } else {
                    setNotifiInfo({
                      active: true,
                      title: "L???i",
                      message: "ID ph??ng kh??ng h???p l??? !!!",
                      type: "danger",
                    });
                  }
                  setRoomIdCreated("");
                }}
              >
                T???o
              </button>
              <button
                className="m-1 p-2 bg-[var(--second)] rounded-lg w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear"
                onClick={() => {
                  createRoomRef.current.classList.remove("active");
                }}
              >
                Hu???
              </button>
            </div>
          </div>
        ) : (
          false
        )}
        <div className="mb-4 mt-2">
          <input
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            type="text"
            className="outline-none border-none rounded-lg p-2 mr-2 text-black"
            placeholder="Nh???p v??o id ph??ng"
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
          {currentUser.createRoom ? (
            <button
              className="p-2 bg-[var(--primary)] rounded-lg m-w-[60px] hover:opacity-[0.5] transition-all duration-200 ease-linear ml-2"
              onClick={() => {
                createRoomRef.current.classList.add("active");
              }}
            >
              T???o ph??ng
            </button>
          ) : (
            false
          )}
        </div>
        <div>
          <p className="text-center">Danh s??ch c??c ph??ng</p>
          <ul className="mt-2">
            {roomsResponse.length > 0 && roomId !== " " ? (
              roomsResponse.map((e, i) => {
                return (
                  <li
                    key={e.roomId}
                    className="flex items-center justify-between p-2 bg-[var(--primary)] rounded-lg cursor-pointer hover:opacity-[0.5] transition-all duration-200 ease-linear w-[260px]"
                    onClick={() => {
                      let exists = false;
                      e.listUser.forEach((element) => {
                        if (element.id === user.id) {
                          exists = true;
                        }
                      });
                      if (!exists) {
                        if (
                          roomData !== null &&
                          roomData.amountUser < roomData.maxUser
                        ) {
                          updateArrayField("Rooms", e.roomId, "listUser", user);
                          updateField(
                            "Rooms",
                            e.roomId,
                            "amountUser",
                            e.amountUser + 1
                          );
                          updateField("Users", user.id, "roomIdJoin", e.roomId);
                          updateArrayField("Notifications", roomId, "content", {
                            author: user,
                            text: `Ng?????i ch??i ${user.username} v???a tham gia v??o ph??ng`,
                            createdAt: moment().format(),
                          });
                        } else {
                          setNotifiInfo({
                            active: true,
                            title: "Ph??ng ?????y",
                            message: "Ph??ng n??y ???? ?????y !!!",
                            type: "warning",
                          });
                        }
                      }
                    }}
                  >
                    <p>{e.roomId}</p>
                    <p>
                      {e.amountUser}/{e.maxUser}
                      <FontAwesomeIcon icon={faUsers} className="ml-2" />
                    </p>
                  </li>
                );
              })
            ) : (
              <>
                <p>Kh??ng t??m th???y ID ph??ng tr??n</p>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default FindRoom;
