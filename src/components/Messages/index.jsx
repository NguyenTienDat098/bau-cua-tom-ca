import { faLeftLong, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import { useState, useRef, useContext, useEffect } from "react";
import { listenDocument, updateArrayField } from "../../firebase/util";
import { UserContext } from "../../providers/User";
import messageAlert from "../../mp3/messageAlert.mp3";
function Messages({ roomId }) {
  const mesBoardRef = useRef();
  const [message, setMessage] = useState("");
  const [messageInRoom, setMessageInRoom] = useState({
    content: [],
    roomId: roomId,
  });
  const UserData = useContext(UserContext);
  const [currentLengthMes, setCurrentLengthMes] = useState(0);
  const messageRef = useRef();
  const inputSendMesRef = useRef();
  const { user } = UserData;
  const audioRef = useRef();
  const [audioSrc, setAudioSrc] = useState(null);
  const boardChatRef = useRef();

  const handleSendMessage = () => {
    updateArrayField("Messages", roomId, "content", {
      author: user,
      roomId: roomId,
      text: message,
      createdAt: moment().format(),
    });
    setMessage("");
    inputSendMesRef.current.focus();
  };

  useEffect(() => {
    const handlePressEnter = (e) => {
      if (e.keyCode === 13) {
        handleSendMessage();
      }
    };
    window.addEventListener("keydown", handlePressEnter);

    return () => {
      window.removeEventListener("keydown", handlePressEnter);
    };
  });

  useEffect(() => {
    listenDocument("Messages", roomId, (data) => {
      if (data !== undefined) {
        setMessageInRoom(data);
      }
    });
  }, [roomId]);

  useEffect(() => {
    setCurrentLengthMes(messageInRoom.content.length);
  }, []);

  useEffect(() => {
    if (messageInRoom.content.length > currentLengthMes) {
      if (
        messageInRoom.content[messageInRoom.content.length - 1].author.id !==
        user.id
      ) {
        messageRef.current.classList.add("active");
        setAudioSrc(messageAlert);
        audioRef.current.play();
        boardChatRef.current.scrollTop = boardChatRef.current.scrollHeight;
      }
    } else {
      setAudioSrc(null);
      messageRef.current.classList.remove("active");
    }
  }, [messageInRoom, currentLengthMes, user.id]);

  return (
    <>
      <audio src={audioSrc} ref={audioRef} hidden></audio>
      <div
        ref={messageRef}
        className="flex items-center justify-center p-2 absolute top-[10px] left-[45px] cursor-pointer text-black bg-white rounded-lg shadow-lg message-new"
        onClick={() => {
          mesBoardRef.current.classList.add("active");
          setCurrentLengthMes(messageInRoom.content.length);
        }}
      >
        <FontAwesomeIcon icon={faMessage} />
      </div>
      <div
        className="absolute top-0 right-0 bottom-0 w-[360px] bg-[white] translate-x-[200%] message shadow-lg flex flex-col"
        ref={mesBoardRef}
      >
        <div
          className="text-black absolute top-[10px] left-[10px]  cursor-pointer hover:opacity-[0.5] transition-all duration-300 ease-out"
          onClick={() => {
            mesBoardRef.current.classList.remove("active");
          }}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </div>

        <p className="text-lg text-gray-700 font-bold p-2 border-b-2 border-gray-700 w-full text-center">
          Tin nhắn
        </p>
        <div
          className="overflow-y-scroll flex-1 scroll-hidden"
          ref={boardChatRef}
        >
          {messageInRoom.content.length > 0
            ? messageInRoom.content.map((e) => {
                return (
                  <div
                    className="flex items-center mb-2 mt-2 message-content ml-2"
                    key={e.createdAt}
                  >
                    <img
                      className="w-[55px] h-[55px] rounded-full shadow-lg"
                      src={e.author.photo}
                      alt="avatar"
                    />
                    <div className="ml-2 p-2 bg-[var(--message)] rounded-lg shadow-lg">
                      <p className="text-sm">{e.author.username}</p>
                      <p className="text-[14px]">{e.text}</p>
                    </div>
                  </div>
                );
              })
            : false}
        </div>
        <div className="flex items-center justify-evenly p-2 border-gray-800 border-t-2 w-full">
          <input
            ref={inputSendMesRef}
            type="text"
            placeholder="Nhập vào tin nhắn..."
            className="p-2 outline-none"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button
            className="p-2 rounded-lg bg-[var(--primary)] hover:opacity-[0.5] transition-all duration-300 ease-out"
            onClick={() => {
              handleSendMessage();
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </>
  );
}

export default Messages;
