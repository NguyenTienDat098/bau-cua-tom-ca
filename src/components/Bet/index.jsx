import chicken from "../../imgs/ga.jpeg";
import deer from "../../imgs/nai.jpeg";
import gourd from "../../imgs/bau.jpeg";
import crab from "../../imgs/cua.jpeg";
import crawfish from "../../imgs/tom.jpeg";
import fish from "../../imgs/ca.jpeg";
import { useContext, useEffect, useRef, useState } from "react";
import { BetContext } from "../../providers/Bet";
import { UserContext } from "../../providers/User";
import { NotificationContext } from "../../providers/Notification";
import {
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";

const betItems = [
  {
    id: 1,
    img: chicken,
    bet: "chicken",
  },
  {
    id: 2,
    img: deer,
    bet: "deer",
  },
  {
    id: 3,
    img: gourd,
    bet: "gourd",
  },
  {
    id: 4,
    img: crab,
    bet: "crab",
  },
  {
    id: 5,
    img: crawfish,
    bet: "crawfish",
  },
  {
    id: 6,
    img: fish,
    bet: "fish",
  },
];

function Bet({ roomId }) {
  const BetData = useContext(BetContext);
  const { betName, setBetName, checkResultBet } = BetData;
  const [valueBet, setValueBet] = useState(0);
  const UserData = useContext(UserContext);
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;
  const { user } = UserData;
  const [roomData, setRoomData] = useState({});
  const buttonBetRef = useRef();
  const [listBet, setListBet] = useState([]);
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

  useEffect(() => {
    listenDocument("Bets", roomId, (data) => {
      if (data !== undefined) {
        setListBet(data.userBets);
      }
    });
  }, [roomId]);

  useEffect(() => {
    if (roomData.statusBet === "open" && listBet.length > 0) {
      listBet.forEach((e, i) => {
        if (i < listBet.length - 1) {
          checkResultBet(e.valueBet, e.nameBet, e.author.id, roomId);
        } else {
          checkResultBet(e.valueBet, e.nameBet, e.author.id, roomId);
          updateField("Rooms", roomId, "statusBet", "close");
        }
      });
    }
  }, [roomData.statusBet, listBet, roomId, checkResultBet]);

  useEffect(() => {
    if (roomData.statusBet !== "jounce") {
      buttonBetRef.current.classList.remove("disable");
    } else {
      buttonBetRef.current.classList.add("disable");
    }
  }, [roomData.statusBet]);

  useEffect(() => {
    const betSelects = document.querySelectorAll(".bet-item");
    betSelects.forEach((e) => {
      e.classList.remove("select");
      if (e.getAttribute("data-bet") === betName) {
        e.classList.add("select");
      }
    });
  }, [betName]);

  return (
    <div className="absolute bottom-[0]  result left-[50%] translate-x-[-50%] flex items-center justify-center flex-col bg-[#3c6382] p-2 rounded-lg rounded-bl-none rounded-br-none shadow-lg bet">
      <div className="flex items-center justify-center flex-col">
        <ul className="flex items-end justify-evenly">
          {betItems.map((e) => {
            return (
              <li
                data-bet={e.bet}
                key={e.id}
                className="bet-item bg-[var(--background)] p-2 w-[100px] h-[100px] cursor-pointer hover:bg-[var(--primary)] transition-all duration-300 ease-in"
                onClick={() => {
                  setBetName(e.bet);
                }}
              >
                <img
                  src={e.img}
                  alt={e.bet}
                  className="w-[100%] object-cover"
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Nh???p v??o s??? xu mu???n c?????c"
          className="p-2 rounded-lg outline-none w-[260px]"
          value={valueBet}
          onChange={(e) => {
            setValueBet(e.target.value);
          }}
        />
        <button
          className="p-2 bg-[var(--primary)] rounded-lg ml-2 disable"
          ref={buttonBetRef}
          onClick={() => {
            if (roomData.statusBet !== "jounce") {
              if (valueBet >= 100 && valueBet <= currentUser.coin) {
                if (betName !== "") {
                  updateArrayField("Bets", roomId, "userBets", {
                    author: user,
                    valueBet: valueBet,
                    nameBet: betName,
                  });
                  setNotifiInfo({
                    active: true,
                    type: "success",
                    message: "?????t c?????c th??nh c??ng",
                    title: "Th??nh c??ng",
                  });
                } else {
                  setNotifiInfo({
                    active: true,
                    type: "warning",
                    message: "Vui l??ng ch???n gi?? tr??? gi?? tr??? c?????c",
                    title: "L???i",
                  });
                }
              } else {
                if (valueBet > currentUser.coin) {
                  setNotifiInfo({
                    active: true,
                    type: "warning",
                    message: "B???n kh??ng ????? ti???n ????? c?????c !!!",
                    title: "L???i",
                  });
                } else if (valueBet < 100) {
                  setNotifiInfo({
                    active: true,
                    type: "warning",
                    message:
                      "Gi?? tr??? c?????c kh??ng h???p l???, gi?? tr??? c?????c t???i thi???u l?? 100 coin",
                    title: "L???i",
                  });
                }
              }
            }
          }}
        >
          C?????c
        </button>
      </div>
    </div>
  );
}

export default Bet;
