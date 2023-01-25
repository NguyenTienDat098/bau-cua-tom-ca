import { useContext, useEffect } from "react";
import { UserContext } from "../../providers/User";
import { useNavigate } from "react-router-dom";
import FindRoom from "../../components/FindRoom";
import Notifications from "../../components/Notifications";
import Loading from "../../components/Loading";
function Home() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const navigate = useNavigate();

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

  if (user) {
    return (
      <>
        <Notifications />
        <FindRoom />
      </>
    );
  }
  return <Loading type={"bubbles"} color={"#00b894"} />;
}

export default Home;
