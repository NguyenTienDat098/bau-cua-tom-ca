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

  if (user) {
    return (
      <>
        <Notifications />
        <Table roomId={roomId} />
        <Results roomId={roomId} />
        <PlayerInfo roomId={roomId} />
        <Messages roomId={roomId} />
      </>
    );
  }
  return <Loading type={"bubbles"} color={"#00b894"} />;
}

export default Room;
