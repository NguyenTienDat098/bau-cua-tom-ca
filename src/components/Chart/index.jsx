import { faChartSimple, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { getCollection } from "../../firebase/util";

function Chart() {
  const [player, setPlayer] = useState([]);
  const [isGet, setIsGet] = useState(false);
  const chartRef = useRef();
  useEffect(() => {
    if (isGet) {
      getCollection("Users")
        .then((res) => {
          setPlayer(
            res.sort((a, b) => {
              return b.coin - a.coin;
            })
          );
          setIsGet(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isGet]);
  return (
    <>
      <div
        onClick={() => {
          setIsGet((prev) => {
            return true;
          });
          chartRef.current.classList.add("active");
        }}
        className="p-2 rounded-lg bg-white absolute top-[10px] left-[10px] text-black flex items-center justify-center cursor-pointer"
      >
        <FontAwesomeIcon icon={faChartSimple} />
      </div>
      <div
        className="absolute top-[0] bottom-0 left-[0] w-[360px] translate-x-[-250%] opacity-0 bg-white shadow-lg text-black flex flex-col items-center chart"
        ref={chartRef}
      >
        <div
          className="absolute top-[10px] left-[10px] cursor-pointer hover:opacity-[0.5] transition-all duration-300 ease-in"
          onClick={() => {
            setIsGet((prev) => {
              return false;
            });
            chartRef.current.classList.remove("active");
          }}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <p className="text-lg text-gray-700 font-bold p-2 border-b-2 border-gray-700 w-full text-center">
          Bảng xếp hạng
        </p>
        <ul className="flex flex-col w-full list-none style-item chart-players overflow-y-scroll scroll-smooth scroll-hidden">
          {player.length > 0
            ? player.map((e) => {
                return (
                  <li
                    key={e.id}
                    className="p-2 w-full items-center flex chart-player"
                  >
                    <div className="w-[60px]">
                      <img
                        src={e.photo}
                        alt="avatar"
                        className="w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <p>{e.username}</p>
                      <p style={{ color: "#fbc531" }}>{e.coin} Coin</p>
                    </div>
                  </li>
                );
              })
            : false}
        </ul>
      </div>
    </>
  );
}

export default Chart;
