import { useContext, useEffect } from "react";
import { UserContext } from "../../providers/User";
import { useNavigate } from "react-router-dom";
import FindRoom from "../../components/FindRoom";
import Notifications from "../../components/Notifications";
function Home() {
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
      <FindRoom />
    </>
  );
}

export default Home;
