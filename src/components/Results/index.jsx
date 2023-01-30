import chicken from "../../imgs/ga.jpeg";
import deer from "../../imgs/nai.jpeg";
import gourd from "../../imgs/bau.jpeg";
import crab from "../../imgs/cua.jpeg";
import crawfish from "../../imgs/tom.jpeg";
import fish from "../../imgs/ca.jpeg";
import plateUp from "../../imgs/dia-mo2.png";
import plateDown from "../../imgs/dia-up.png";
import { useContext, useEffect, useRef, useState } from "react";
import {
  getSimpleDocument,
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { UserContext } from "../../providers/User";
import Bet from "../Bet";
import { BetContext } from "../../providers/Bet";
import moment from "moment/moment";
const bets = [
  {
    name: "chicken",
    img: chicken,
  },
  {
    name: "deer",
    img: deer,
  },
  {
    name: "crab",
    img: crab,
  },
  {
    name: "gourd",
    img: gourd,
  },
  {
    name: "fish",
    img: fish,
  },
  {
    name: "crawfish",
    img: crawfish,
  },
];

function Result({ roomId }) {
  const diceRef = useRef();
  const plateDownRef = useRef();
  const plateUpRef = useRef();
  const plateUpPlayerRef = useRef();
  const plateDownPlayerRef = useRef();
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [roomInfo, setRoomInfo] = useState({});
  const BetData = useContext(BetContext);
  const { randomResultBet } = BetData;
  const [roomData, setRoomData] = useState({});
  const [resultBet, setResultBet] = useState({
    firstResult: "",
    secondResult: "",
    thirdResult: "",
  });

  const [imgResult, setImgResult] = useState({
    firstImgResult: gourd,
    secondImgResult: crab,
    thirdImgResult: fish,
  });

  useEffect(() => {
    listenDocument("Bets", roomId, (data) => {
      if (data !== undefined) {
        setResultBet(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    bets.forEach((e) => {
      if (resultBet.firstResult && resultBet.firstResult === e.name) {
        setImgResult((prev) => {
          return {
            ...prev,
            firstImgResult: e.img,
          };
        });
      }
      if (resultBet.secondResult && resultBet.secondResult === e.name) {
        setImgResult((prev) => {
          return {
            ...prev,
            secondImgResult: e.img,
          };
        });
      }
      if (resultBet.thirdResult && resultBet.thirdResult === e.name) {
        setImgResult((prev) => {
          return {
            ...prev,
            thirdImgResult: e.img,
          };
        });
      }
    });
  }, [resultBet]);

  useEffect(() => {
    listenDocument("Rooms", roomId, (data) => {
      setRoomData(data);
    });
  }, [roomId]);

  useEffect(() => {
    if (roomData.statusBet === "cover" || roomData.statusBet === "jounce") {
      if (plateUpPlayerRef.current && plateDownPlayerRef.current) {
        plateUpPlayerRef.current.classList.add("cover");
        plateDownPlayerRef.current.classList.add("cover");
      }
    } else if (roomData.statusBet === "open" && plateDownPlayerRef.current) {
      plateDownPlayerRef.current.classList.remove("cover");
    } else if (
      roomData.statusBet === "close" &&
      plateDownPlayerRef.current &&
      plateUpPlayerRef.current
    ) {
      plateDownPlayerRef.current.classList.remove("cover");
      plateUpPlayerRef.current.classList.remove("cover");
    }
  }, [roomData, plateUpPlayerRef, plateDownPlayerRef]);

  useEffect(() => {
    getSimpleDocument("Rooms", roomId)
      .then((res) => {
        setRoomInfo(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [roomId]);

  if (user && user.id === roomInfo.owner) {
    return (
      <>
        <div
          className="absolute top-[35%] left-[50%] translate-x-[-450%] translate-y-[-50%] plate-up"
          ref={plateUpRef}
        >
          <img src={plateUp} alt="plate" className="bet-player" />
        </div>
        <div
          className="absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[250%] w-[400px] z-10 plate-down"
          ref={plateDownRef}
        >
          <img src={plateDown} alt="plate" />
        </div>
        <div
          className="flex items-center justify-center result-dice"
          ref={diceRef}
        >
          <ul className="flex items-center justify-center mb-2">
            <li className="m-1 animate-bounce rounded-full overflow-hidden border-2 border-gray-800">
              <img
                src={imgResult.firstImgResult}
                alt="result"
                className="w-[100%] object-cover scale-[1.3]"
              />
            </li>
            <li className="m-1 animate-bounce rounded-full overflow-hidden border-2 border-gray-800">
              <img
                src={imgResult.secondImgResult}
                alt="result"
                className="w-[100%] object-cover scale-[1.3]"
              />
            </li>
            <li className="m-1 animate-bounce rounded-full overflow-hidden border-2 border-gray-800">
              <img
                src={imgResult.thirdImgResult}
                alt="result"
                className="w-[100%] object-cover scale-[1.3]"
              />
            </li>
          </ul>
        </div>
        <div className="absolute bottom-[0] w-[400px] result left-[50%] translate-x-[-50%] flex items-center justify-center flex-col bg-[#3c6382] p-2 rounded-lg rounded-bl-none rounded-br-none shadow-lg controll">
          <div className="btn-controll">
            <button
              className="p-3 text-center rounded-lg m-1 bg-[#eb4d4b]"
              onClick={() => {
                plateUpRef.current.classList.add("active");
                diceRef.current.classList.add("dice");
                setTimeout(() => {
                  plateDownRef.current.classList.add("active");
                }, 500);
                updateField("Rooms", roomId, "statusBet", "cover");
                updateArrayField("Notifications", roomId, "content", {
                  author: user,
                  text: "Chủ phòng đang chuẩn bị lắc bầu cua, bạn có thể cược sau khi lắc xong",
                  createdAt: moment().format(),
                });
              }}
            >
              Đậy
            </button>
            <button
              className="p-3 text-center rounded-lg m-1 bg-[#6ab04c]"
              onClick={() => {
                diceRef.current.classList.add("hidden-dice");
                randomResultBet(roomId);
                updateField("Rooms", roomId, "statusBet", "jounce");
                updateArrayField("Notifications", roomId, "content", {
                  author: user,
                  text: "Bạn có thể đặt cược bây giờ, kết quả sẽ có ngay sau khi chủ phòng mở bát",
                  createdAt: moment().format(),
                });
              }}
            >
              Lắc
            </button>
            <button
              className="p-3 text-center rounded-lg m-1 bg-[#22a6b3]"
              onClick={() => {
                diceRef.current.classList.remove("hidden-dice");
                plateDownRef.current.classList.remove("active");
                updateField("Rooms", roomId, "statusBet", "open");
              }}
            >
              Mở
            </button>
            <button
              className="p-3 text-center rounded-lg m-1 bg-[#fdcb6e]"
              onClick={() => {
                updateField("Bets", roomId, "userBets", []);
                plateDownRef.current.classList.remove("active");
                plateUpRef.current.classList.remove("active");
                diceRef.current.classList.remove("dice");
                diceRef.current.classList.remove("hidden-dice");
                updateField("Rooms", roomId, "statusBet", "close");
              }}
            >
              Bỏ
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        className="absolute top-[0px] right-[0px] translate-x-[0%] translate-y-[0%] w-[240px] plate-up-player"
        ref={plateUpPlayerRef}
      >
        <img src={plateUp} alt="plate" className="w-[100%] object-cover" />
        <ul className="w-[130px] flex items-center justify-center mb-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <li className="m-1 rounded-full overflow-hidden border-2 border-gray-800  animate-bounce">
            <img
              src={imgResult.firstImgResult}
              alt="result"
              className="object-cover rounded-lg w-[100%] scale-[1.3]"
            />
          </li>
          <li className="m-1 rounded-full overflow-hidden border-2 border-gray-800  animate-bounce">
            <img
              src={imgResult.secondImgResult}
              alt="result"
              className="object-cover rounded-lg w-[100%] scale-[1.3]"
            />
          </li>
          <li className="m-1 rounded-full overflow-hidden border-2 border-gray-800  animate-bounce">
            <img
              src={imgResult.thirdImgResult}
              alt="result"
              className="object-cover rounded-lg w-[100%] scale-[1.3]"
            />
          </li>
        </ul>
      </div>
      <div
        className="absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[250%] w-[400px] z-10 plate-down plate-down-player"
        ref={plateDownPlayerRef}
      >
        <img src={plateDown} alt="plate" />
      </div>
      <Bet roomId={roomId} />
    </>
  );
}

export default Result;
