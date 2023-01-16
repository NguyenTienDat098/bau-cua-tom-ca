import { useContext, useEffect } from "react";
import { UserContext } from "../../providers/User";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import Result from "../../components/Results";
function Home() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <>
      <Table />
      <Result />
    </>
  );
}

export default Home;
