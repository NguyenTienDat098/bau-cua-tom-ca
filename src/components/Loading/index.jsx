import ReactLoading from "react-loading";
function Loading({ type, color }) {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <ReactLoading type={type} color={color} height={80} width={80} />
      </div>
    </>
  );
}

export default Loading;
