import Table from "../../components/Table";
import Results from "../../components/Results";
import { useNavigate, useParams } from "react-router-dom";
import Notifications from "../Notifications";
import PlayerInfo from "../PlayerInfo";
import Messages from "../Messages";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../providers/User";
import Loading from "../Loading";
import { listenDocument } from "../../firebase/util";
import { NotificationContext } from "../../providers/Notification";
import moment from "moment/moment";
import Chart from "../Chart";
function Room() {
  const { roomId } = useParams();
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const navigate = useNavigate();
  const NotificationsData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationsData;
  const [notifications, setNotifications] = useState({
    content: [],
    roomId: roomId,
  });
  const [isResponse, setIsResponse] = useState(false);

  useEffect(() => {
    const handleResponse = () => {
      if (window.innerWidth < 500) {
        setIsResponse(false);
        setNotifiInfo({
          active: true,
          title: "Thông báo",
          type: "info",
          message:
            "Vui lòng sử dụng ở chế độ xoay ngang màn hình để có trải nhiệm tốt nhất !",
        });
      } else {
        setIsResponse(true);
      }
    };
    window.addEventListener("DOMContentLoaded", handleResponse());
    window.addEventListener("resize", handleResponse);

    return () => {
      window.removeEventListener("DOMContentLoaded", handleResponse());
      window.removeEventListener("resize", handleResponse);
    };
  }, []);
  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      if (user.roomIdJoin !== "") {
        setTimeout(() => {
          navigate(`/room/${user.roomIdJoin}`);
        }, 3000);
      }
    }
  }, [navigate, user]);

  useEffect(() => {
    listenDocument("Notifications", roomId, (data) => {
      if (data !== undefined) {
        setNotifications(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    if (notifications.content.length > 0) {
      const currentTime = moment();
      const createdAt = moment(
        notifications.content[notifications.content.length - 1].createdAt
      );
      const timeDiff = currentTime.diff(createdAt, "minutes");

      if (timeDiff < 2) {
        setNotifiInfo({
          active: true,
          title:
            notifications.content[notifications.content.length - 1].author
              .username,
          type: "info",
          message: notifications.content[notifications.content.length - 1].text,
        });
      }
    }
  }, [notifications, setNotifiInfo]);

  if (user && isResponse) {
    return (
      <>
        <Notifications />
        <Table roomId={roomId} />
        <Results roomId={roomId} />
        <PlayerInfo roomId={roomId} />
        <Messages roomId={roomId} />
        <Chart />
      </>
    );
  }
  return (
    <>
      <Notifications />
      <Loading type={"bubbles"} color={"#00b894"} />
    </>
  );
}

export default Room;
