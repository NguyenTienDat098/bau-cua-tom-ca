import { faMusic, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";

function Music({ source }) {
  const audioRef = useRef();
  const [faHandle, setFaHandle] = useState(faMusic);

  useEffect(() => {
    if (source !== null) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [source]);
  return (
    <div>
      <div
        className="absolute top-[10px] left-[118px] p-2 flex items-center justify-center cursor-pointer text-black bg-white rounded-lg transition-all duration-300 ease-in"
        onClick={() => {
          if (audioRef.current.muted === true) {
            audioRef.current.muted = false;
            setFaHandle(faVolumeXmark);
          } else {
            audioRef.current.muted = true;
            setFaHandle(faMusic);
          }
        }}
      >
        <FontAwesomeIcon icon={faHandle} />
      </div>
      <audio src={source} ref={audioRef} hidden muted={true}></audio>
    </div>
  );
}

export default Music;
