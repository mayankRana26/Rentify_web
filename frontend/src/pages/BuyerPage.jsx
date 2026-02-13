import HeroBuyer from "../components/buyer/HeroBuyer";
import RentOrSell from "../components/buyer/RentOrSell";
import CategoryTiles from "../components/CategoryTiles";
import BrowsePage from "./BrowsePage";

const BuyerPage = () => {
  return (
    <div className="py-10 px-2 mx-auto">
      <CategoryTiles />
      <HeroBuyer />
      <RentOrSell />

      {/* 👇 BrowsePage ke top par CategoryTiles NAHI dikhega */}
      <BrowsePage showCategories={false} />
    </div>
  );
};

export default BuyerPage;
