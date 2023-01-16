import { Link } from "react-router-dom";

function SignUp() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center login-bg">
        <div className="p-[20px] bg-[var(--background-item)] text-[var(--black)] rounded-lg shadow w-[320px] acount-page">
          <h1 className="text-[36px] mb-2">Đăng ký</h1>
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
          <div className="flex flex-col justify-center">
            <label
              htmlFor="input-password"
              className="text-gray-600 text-[14px] ml-2"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập vào email..."
              id="input-email"
              className="mb-[1em] outline-none pt-1 pb-1 pl-2 pr-2 border-b-2 border-gray-300 focus:border-gray-700 transition-all duration-300 ease-in"
              required={true}
            />
          </div>
          <button className="w-[100%] p-1 mt-1 mb-3 rounded-[var(--border-radius)] bg-[var(--primary)] text-[var(--white)]">
            Đăng ký
          </button>
          <div>
            <p className="text-center">
              <Link to={"/"} className="text-[var(--link-color)] text-center">
                Đã có tài khoản
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
