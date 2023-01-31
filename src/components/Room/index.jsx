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
import Music from "../Music";
import xoso from "../../mp3/xoso.mp3";
import xucxac from "../../mp3/xucxac.mp3";

function Room() {
  const [musicSrc, setMusicSrc] = useState(null);
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
  const [currentUser, setCurrentUser] = useState(null);
  const [roomData, setRoomData] = useState(null);

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
    listenDocument("Rooms", roomId, (data) => {
      if (data !== undefined) {
        setRoomData(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    if (roomData !== null) {
      if (roomData.statusBet === "start" || roomData.statusBet === "cover") {
        setMusicSrc(xoso);
      } else if (roomData.statusBet === "jounce") {
        setMusicSrc(xucxac);
      } else {
        setMusicSrc(null);
      }
    }
  }, [roomData]);

  useEffect(() => {
    if (user) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser(data);
        }
      });
    }
  }, [roomId, user]);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      if (currentUser !== null && currentUser.roomIdJoin !== "") {
        setTimeout(() => {
          navigate(`/room/${currentUser.roomIdJoin}`);
        }, 3000);
      }
    }
  }, [navigate, user, currentUser]);

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

      if (timeDiff < 1) {
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
        <Music source={musicSrc} />
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
