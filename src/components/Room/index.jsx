import Table from "../../components/Table";
import Results from "../../components/Results";
import { useNavigate, useParams } from "react-router-dom";
import Notifications from "../Notifications";
import PlayerInfo from "../PlayerInfo";
import Messages from "../Messages";
import { useEffect, useContext } from "react";
import { UserContext } from "../../providers/User";
function Room() {
  const { roomId } = useParams();
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      if (user.roomIdJoin !== "") {
        navigate(`/room/${user.roomIdJoin}`);
      }
    }
  }, [navigate, user]);
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

export default Room;
