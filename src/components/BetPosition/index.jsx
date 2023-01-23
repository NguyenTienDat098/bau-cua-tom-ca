import { useContext } from "react";
import { UserContext } from "../../providers/User";

function BetPosition({ betName }) {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  return (
    <div className="rounded-full w-[80px] h-[80px] border-4 border-gray-900">
      <img src={user.photo} alt="player" className="w-[100%] object-cover" />
    </div>
  );
}

export default BetPosition;
