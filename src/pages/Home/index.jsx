import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/User";
import { useNavigate } from "react-router-dom";
import FindRoom from "../../components/FindRoom";
import Notifications from "../../components/Notifications";
import Loading from "../../components/Loading";
import { NotificationContext } from "../../providers/Notification";
function Home() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const navigate = useNavigate();
  const [isResponse, setIsResponse] = useState(false);
  const NotificationData = useContext(NotificationContext);
  const { setNotifiInfo } = NotificationData;
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

  if (user && isResponse) {
    return (
      <>
        <Notifications />
        <FindRoom />
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

export default Home;
