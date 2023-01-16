import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../../components/Notifications";
import { UserContext } from "../../providers/User";

function Login() {
  const UserData = useContext(UserContext);
  const { signInWithGoogle, user } = UserData;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <Notifications
        info="notify"
        message="Chức năng đăng nhập bằng Facebook và Github hiện chưa code xong, vui lòng đăng nhập bằng Google hoặc Email"
        active={true}
      />
      <div className="w-full h-screen flex items-center justify-center login-bg">
        <div className="p-[20px] bg-[var(--background-item)] text-[var(--black)] rounded-lg shadow w-[320px] acount-page">
          <h1 className="text-[36px] mb-2">Đăng nhập</h1>
          <div className="flex flex-col justify-center">
            <label
              htmlFor="input-name"
              className="text-gray-600 text-[14px] ml-2"
            >
              Username
            </label>
            <input
              type="text"
              id="input-name"
              placeholder="Nhập vào username..."
              className="mb-[1em] outline-none pt-1 pb-1 pl-2 pr-2 border-b-2 border-gray-300 focus:border-gray-700 transition-all duration-300 ease-in"
              required={true}
            />
          </div>
          <div className="flex flex-col justify-center">
            <label
              htmlFor="input-password"
              className="text-gray-600 text-[14px] ml-2"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Nhập vào password..."
              id="input-password"
              className="mb-[1em] outline-none pt-1 pb-1 pl-2 pr-2 border-b-2 border-gray-300 focus:border-gray-700 transition-all duration-300 ease-in"
              required={true}
            />
          </div>
          <button className="w-[100%] p-1 mt-1 mb-3 rounded-[var(--border-radius)] bg-[var(--primary)] text-[var(--white)]">
            Đăng nhập
          </button>
          <div className="flex items-center justify-center flex-col">
            <p>Đăng nhập bằng</p>
            <div>
              <FontAwesomeIcon
                icon={faFacebook}
                className="p-1 cursor-pointer m-2 text-[22px] rounded-full text-[#fff] bg-[#1B9CFC]"
              />
              <FontAwesomeIcon
                icon={faGoogle}
                className="p-1 cursor-pointer m-2 text-[22px] rounded-full text-[#fff] bg-[#FC427B]"
                onClick={() => {
                  signInWithGoogle();
                }}
              />
              <FontAwesomeIcon
                icon={faGithub}
                className="p-1 cursor-pointer m-2 text-[22px] rounded-full text-[#fff] bg-[#000]"
              />
              <p>
                <Link to={"/signup"} className="text-[var(--link-color)]">
                  hoặc tạo tài khoản
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
