function BetPosition({ betName, userBet }) {
  return (
    <div className="rounded-full w-[40px] h-[40px] border-2 border-white relative z-10 player-bet overflow-hidden">
      <img
        src={userBet.photo}
        alt="player"
        className="w-[100%] object-cover bg-[var(--background)]"
      />
    </div>
  );
}

export default BetPosition;
// Write me a message Component and css for this component
