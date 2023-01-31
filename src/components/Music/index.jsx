import { useEffect, useRef } from "react";

function Music({ source }) {
  const audioRef = useRef();
  useEffect(() => {
    if (source !== null) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [source]);
  return (
    <div>
      <audio src={source} ref={audioRef} hidden></audio>
    </div>
  );
}

export default Music;
