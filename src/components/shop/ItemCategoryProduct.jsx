import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";

export default function ItemCategoryProduct({ serie }) {
  // const setSelectedProduct = useStore(state => state.setSelectedProduct);
  // const navigate = useNavigate();

  function handleClick() {
    // setSelectedProduct(product);
    // navigate("/detalle");
  }

  return (
    <div className="w-[370px] flex flex-col gap-y-8">
      <img
        className="h-[370px] flex items-center justify-center rounded-xl border"
        src={serie.image}
        alt="imagen del producto"
      />
      <div className="flex flex-col gap-y-3">
        <p className="text-2xl">{serie.name}</p>
        <span onClick={handleClick} className="text-sm cursor-pointer">
          Learn More
        </span>
      </div>
    </div>
  );
}
