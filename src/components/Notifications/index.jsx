import {
  faCircleExclamation,
  faMessage,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function Notifications({ info, message, active }) {
  const [showNotify, setShowNotify] = useState(active);
  const [counter, setCounter] = useState(25);
  useEffect(() => {
    if (showNotify) {
      const interval = setInterval(() => {
        if (showNotify) {
          if (counter > 0) {
            setCounter((prev) => prev - 1);
          }
          if (counter <= 0) {
            setShowNotify(false);
          }
        }
      }, 200);
      return () => {
        clearInterval(interval);
      };
    }
  }, [showNotify, counter]);

  if (showNotify) {
    if (info === "error") {
      return (
        <div className="notification bg-[#ff6b81] text-[#fff] rounded-lg p-2 flex items-center justify-between shadow overflow-hidden">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="mr-2 border-r-2 border-white p-2 text-[20px]"
          />
          <p>{message}</p>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[white] transition-all duration-200 ease-linear"
            style={{
              width: `${counter * 4}%`,
              height: 2,
            }}
          ></div>
        </div>
      );
    } else if (info === "notify") {
      return (
        <div className="notification bg-[#22a6b3] text-[#fff] rounded-lg p-2 flex items-center justify-between shadow overflow-hidden">
          <FontAwesomeIcon
            icon={faMessage}
            className="mr-2 border-r-2 border-white p-2 text-[20px]"
          />
          <p>{message}</p>
          <div
            className="absolute bottom-0 left-0 right-0 bg-[white] transition-all duration-200 ease-linear"
            style={{
              width: `${counter * 4}%`,
              height: 2,
            }}
          ></div>
        </div>
      );
    }
    return (
      <div className="notification bg-[#fbc531] text-[#fff] rounded-lg p-2 flex items-center justify-between shadow overflow-hidden">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="mr-2 border-r-2 border-white p-2 text-[20px]"
        />
        <p>{message}</p>
        <div
          className="absolute bottom-0 left-0 right-0 bg-[white] transition-all duration-200 ease-linear"
          style={{
            width: `${counter * 4}%`,
            height: 2,
          }}
        ></div>
      </div>
    );
  }
}

export default Notifications;
