import { formatCurrency } from "@/helpers";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";

export default function FilterProductItem({ product }) {
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const navigate = useNavigate();

  function handleClick() {
    setSelectedProduct(product);
    navigate("/detail");
  }

  return (
    <div
      onClick={handleClick}
      className="flex px-[22px] py-[29px] gap-x-[61px] shadow-md bg-white cursor-pointer"
    >
      <img
        className="w-[143px] h-[121px] border flex justify-center items-center rounded-md"
        src={product.image}
        alt="iamgen del producto"
      />
      <div className="flex flex-col">
        <p className="font-bold">{product.name}</p>
        <span className="text-lg">
          Por: {product.brand} - Serie: {product.serie.name}
        </span>
        <span className="text-4xl font-bold">
          {formatCurrency(product.price)}
        </span>
      </div>
    </div>
  );
}
