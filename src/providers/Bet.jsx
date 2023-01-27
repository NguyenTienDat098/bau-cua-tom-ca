import { createContext, useContext, useMemo, useState } from "react";
import { addDocument, getSimpleDocument, updateField } from "../firebase/util";
import { NotificationContext } from "./Notification";

export const BetContext = createContext();
function Bet({ children }) {
  const [betName, setBetName] = useState("");
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;

  const randomResultBet = (roomId) => {
    const bets = ["chicken", "deer", "crab", "gourd", "fish", "crawfish"];
    let firstRandomResult = bets[Math.floor(Math.random() * bets.length)];
    let secondRandomResult = bets[Math.floor(Math.random() * bets.length)];
    let thirdRandomResult = bets[Math.floor(Math.random() * bets.length)];

    addDocument("Bets", roomId, {
      firstResult: firstRandomResult,
      secondResult: secondRandomResult,
      thirdResult: thirdRandomResult,
      userBets: [],
    });
  };

  const checkResultBet = (betValue, nameBet, userId, roomId) => {
    getSimpleDocument("Rooms", roomId)
      .then((roomRes) => {
        getSimpleDocument("Bets", roomId)
          .then((betRes) => {
            if (
              betRes.firstResult !== "" &&
              betRes.secondResult !== "" &&
              betRes.thirdResult !== ""
            ) {
              let winPrize = 1;
              switch (nameBet) {
                case betRes.firstResult:
                  winPrize++;
                  break;
                case betRes.secondResult:
                  winPrize++;
                  break;
                case betRes.thirdResult:
                  winPrize++;
                  break;
                default:
                  break;
              }
              if (winPrize > 1) {
                getSimpleDocument("Users", userId)
                  .then((userRes) => {
                    updateField(
                      "Users",
                      userId,
                      "coin",
                      parseInt(userRes.coin) + parseInt(betValue) * winPrize
                    );
                    setNotifiInfo({
                      active: true,
                      type: "info",
                      message: `Bạn nhận được ${
                        parseInt(betValue) * parseInt(winPrize)
                      } coin`,
                      title: "Thông báo",
                    });
                    getSimpleDocument("Users", roomRes.owner)
                      .then((res) => {
                        updateField(
                          "Users",
                          roomRes.owner,
                          "coin",
                          parseInt(res.coin) - parseInt(betValue) * winPrize
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                getSimpleDocument("Users", userId)
                  .then((res) => {
                    updateField(
                      "Users",
                      userId,
                      "coin",
                      parseInt(res.coin) - parseInt(betValue)
                    );
                    setNotifiInfo({
                      active: true,
                      type: "info",
                      message: `Hụt rồi bạn bị trừ ${betValue} coin !!!`,
                      title: "Thông báo",
                    });
                    getSimpleDocument("Users", roomRes.owner)
                      .then((res) => {
                        updateField(
                          "Users",
                          roomRes.owner,
                          "coin",
                          parseInt(res.coin) + parseInt(betValue)
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              updateField("Bets", roomId, "firstResult", "");
              updateField("Bets", roomId, "secondResult", "");
              updateField("Bets", roomId, "thirdResult", "");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const value = useMemo(
    () => ({
      betName,
      setBetName,
      randomResultBet,
      checkResultBet,
    }),
    [betName]
  );
  return <BetContext.Provider value={value}>{children}</BetContext.Provider>;
}

export default Bet;
