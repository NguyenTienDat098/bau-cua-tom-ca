import ga from "../../imgs/ga.jpeg";
import nai from "../../imgs/nai.jpeg";
import bau from "../../imgs/bau.jpeg";
import cua from "../../imgs/cua.jpeg";
import tom from "../../imgs/tom.jpeg";
import ca from "../../imgs/ca.jpeg";
function Table() {
  return (
    <div className="absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[60%] flex items-center justify-center p-[40px] rounded-full bg-[#6ab04c] shadow-lg">
      <div className="player">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
          alt="player"
        />
      </div>
      <div className="player">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9307/9307788.png"
          alt="player"
        />
      </div>
      <div className="player">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1790/1790602.png"
          alt="player"
        />
      </div>
      <div className="player">
        <img
          src="https://cdn-icons-png.flaticon.com/512/293/293939.png"
          alt="player"
        />
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="table-item">
          <img src={ga} alt="table" />
        </div>
        <div className="table-item">
          <img src={nai} alt="table" />
        </div>
        <div className="table-item">
          <img src={bau} alt="table" />
        </div>
        <div className="table-item">
          <img src={cua} alt="table" />
        </div>
        <div className="table-item">
          <img src={tom} alt="table" />
        </div>
        <div className="table-item">
          <img src={ca} alt="table" />
        </div>
      </div>
    </div>
  );
}

export default Table;
