import { createContext, useEffect, useMemo, useState } from "react";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
// preferred way to import (from `v4`). Uses `animate__` prefix.
import "animate.css/animate.min.css";
// Alternate way to use classes without prefix like `animated fadeIn`
import "animate.css/animate.compat.css";
export const NotificationContext = createContext();
function Notification({ children }) {
  const [notifiInfo, setNotifiInfo] = useState({
    active: false,
    type: "",
    message: "",
    title: "",
  });
  useEffect(() => {
    if (notifiInfo.active) {
      setTimeout(() => {
        setNotifiInfo({
          active: false,
          type: "",
          message: "",
          title: "",
        });
      }, 5000);
    }
  }, [notifiInfo.active]);
  useEffect(() => {
    if (notifiInfo.active) {
      Store.addNotification({
        title: notifiInfo.title,
        message: notifiInfo.message,
        type: notifiInfo.type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__bounceIn"],
        animationOut: ["animate__animated", "animate__bounceOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  }, [notifiInfo]);
  const value = useMemo(
    () => ({
      notifiInfo,
      setNotifiInfo,
    }),
    [notifiInfo]
  );
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default Notification;
