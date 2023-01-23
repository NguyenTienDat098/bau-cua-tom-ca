import { createContext, useContext, useMemo, useState } from "react";
import { addDocument, getSimpleDocument, updateField } from "../firebase/util";
import { NotificationContext } from "./Notification";

export const BetContext = createContext();
function Bet({ children }) {
  const [betName, setBetName] = useState();
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
    console.log("here");
    getSimpleDocument("Bets", roomId)
      .then((res) => {
        let winPrize = 1;
        switch (nameBet) {
          case res.firstResult:
            winPrize++;
            break;
          case res.secondResult:
            winPrize++;
            break;
          case res.thirdResult:
            winPrize++;
            break;
          default:
            break;
        }
        if (winPrize > 1) {
          getSimpleDocument("Users", userId)
            .then((res) => {
              updateField(
                "Users",
                userId,
                "coin",
                parseInt(res.coin) + parseInt(betValue) * winPrize
              );
              setNotifiInfo({
                active: true,
                type: "info",
                message: `Bạn nhận được ${
                  parseInt(betValue) * parseInt(winPrize)
                } coin`,
                title: "Thông báo",
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
        updateField("Bets", roomId, "firstResult", "");
        updateField("Bets", roomId, "secondResult", "");
        updateField("Bets", roomId, "thirdResult", "");
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
