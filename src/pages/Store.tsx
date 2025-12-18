import Sidebar from "../components/Sidebar";
import GameList from "../components/GameList";
import { useSearchParams } from "react-router-dom";

function Store() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="mt-[160px] pr-[16px] bg-black min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar setSearchParams={setSearchParams} />
        <div className="flex-1">
          <GameList searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}

export default Store;
