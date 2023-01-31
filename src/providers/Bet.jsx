import { createContext, useContext, useMemo, useState } from "react";
import { getSimpleDocument, updateField } from "../firebase/util";
import { NotificationContext } from "./Notification";
import { UserContext } from "./User";

export const BetContext = createContext();
function Bet({ children }) {
  const [betName, setBetName] = useState("");
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const randomResultBet = (roomId) => {
    const bets = ["chicken", "deer", "crab", "gourd", "fish", "crawfish"];
    let firstRandomResult = bets[Math.floor(Math.random() * bets.length)];
    let secondRandomResult = bets[Math.floor(Math.random() * bets.length)];
    let thirdRandomResult = bets[Math.floor(Math.random() * bets.length)];

    updateField("Bets", roomId, "firstResult", firstRandomResult);
    updateField("Bets", roomId, "secondResult", secondRandomResult);
    updateField("Bets", roomId, "thirdResult", thirdRandomResult);
  };

  const checkResultBet = (betValue, nameBet, userId, roomId) => {
    let winPrize = 0;

    getSimpleDocument("Rooms", roomId)
      .then((roomResponse) => {
        getSimpleDocument("Bets", roomId)
          .then((betResponse) => {
            if (roomResponse !== null && betResponse !== null) {
              if (
                betResponse.firstResult !== "" &&
                betResponse.secondResult !== "" &&
                betResponse.thirdResult !== ""
              ) {
                switch (nameBet) {
                  case betResponse.firstResult:
                    winPrize++;
                    break;
                  case betResponse.secondResult:
                    winPrize++;
                    break;
                  case betResponse.thirdResult:
                    winPrize++;
                    break;
                  default:
                    break;
                }
                if (winPrize >= 1) {
                  getSimpleDocument("Users", userId)
                    .then((userRes) => {
                      updateField(
                        "Users",
                        userId,
                        "coin",
                        parseInt(userRes.coin) + parseInt(betValue) * winPrize
                      );
                      getSimpleDocument("Users", roomResponse.owner)
                        .then((res) => {
                          updateField(
                            "Users",
                            roomResponse.owner,
                            "coin",
                            parseInt(res.coin) - parseInt(betValue) * winPrize
                          );
                          if (userRes.id === user.id) {
                            setNotifiInfo({
                              active: true,
                              type: "info",
                              message: `Bạn nhận được ${
                                parseInt(betValue) * parseInt(winPrize)
                              } coin`,
                              title: "Thông báo",
                            });
                          }
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
                    .then((userRes) => {
                      updateField(
                        "Users",
                        userId,
                        "coin",
                        parseInt(userRes.coin) - parseInt(betValue)
                      );
                      getSimpleDocument("Users", roomResponse.owner)
                        .then((res) => {
                          updateField(
                            "Users",
                            roomResponse.owner,
                            "coin",
                            parseInt(res.coin) + parseInt(betValue)
                          );
                          if (userRes.id === user.id) {
                            setNotifiInfo({
                              active: true,
                              type: "info",
                              message: `Hụt rồi bạn bị trừ ${betValue} coin !!!`,
                              title: "Thông báo",
                            });
                          }
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
