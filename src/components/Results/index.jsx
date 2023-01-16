import ga from "../../imgs/ga.jpeg";
function Result() {
  return (
    <>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></div>
      <div className="absolute bottom-[0] w-[400px] result left-[50%] translate-x-[-50%] flex items-center justify-center flex-col bg-[#3c6382] p-2 rounded-lg rounded-bl-none rounded-br-none shadow-lg">
        <div className="flex items-center justify-center">
          <ul className="flex items-center justify-center mb-2">
            <li className="m-1">
              <img src={ga} alt="result" />
            </li>
            <li className="m-1">
              <img src={ga} alt="result" />
            </li>
            <li className="m-1">
              <img src={ga} alt="result" />
            </li>
          </ul>
        </div>
        <div>
          <button className="p-3 text-center rounded-lg  m-1 bg-[#eb4d4b]">
            Đậy
          </button>
          <button className="p-3 text-center rounded-lg  m-1 bg-[#6ab04c]">
            Lắc
          </button>
          <button className="p-3 text-center rounded-lg  m-1 bg-[#22a6b3]">
            Mở
          </button>
        </div>
      </div>
    </>
  );
}

export default Result;
