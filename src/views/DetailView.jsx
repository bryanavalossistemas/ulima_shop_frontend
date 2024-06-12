import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers";
import { useStore } from "@/store";
import { Dot, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function DetaiView() {
  const selectedProduct = useStore((state) => state.selectedProduct);

  const addToCart = useStore((state) => state.addToCart);
  const [itemQuantity, setItemQuantity] = useState(1);

  function handleAddToCart() {
    const newCartItem = {
      ...selectedProduct,
      quantity: itemQuantity,
    };
    addToCart(newCartItem);
  }

  return (
    <main className="text-2xl pt-[15px] px-[40px] pb-[36px]">
      <h1 className="text-[32px] mb-[15px]">
        Titulo de Producto: {selectedProduct.name}
      </h1>
      <p className="mb-[26px]">
        Por: <span className="font-bold">{selectedProduct.brand}</span> - Serie:{" "}
        <span className="font-bold">{selectedProduct.serie.name}</span>
      </p>
      <Separator className="bg-black h-[3px] mb-[56px]" />
      <div className="mb-[25px] flex justify-between gap-x-[50px]">
        <div className="bg-white w-full border border-slate-300 rounded-xl flex items-center justify-center">
          <img src={selectedProduct.image} className="h-[641px]" />
        </div>
        <div className="border border-slate-500 min-w-[399px] flex flex-col items-center">
          <h2 className="min-h-[68px] flex items-center justify-center border-b w-full bg-white">
            DISPONIBLE
          </h2>
          <div className="flex flex-col px-[35px] w-full items-center pt-[48px] pb-[83px] bg-slate-300 h-full">
            <span className="font-bold text-5xl mb-[44px]">
              {formatCurrency(selectedProduct.price)}
            </span>
            <button
              className="mb-[64px] rounded-md w-full h-[65px] bg-slate-700 text-white flex items-center justify-center text-[20px]"
              onClick={handleAddToCart}
            >
              AÑADIR AL CARRITO
            </button>
            <span className="font-bold text-[20px] mb-[30px]">Cantidad:</span>
            <div className="flex items-center gap-x-[20px] mb-[70px]">
              <button className="flex items-center">
                <Minus
                  strokeWidth={3}
                  onClick={() => {
                    itemQuantity !== 1 && setItemQuantity(itemQuantity - 1);
                  }}
                />
              </button>
              <span className="w-[88px] h-[55.28px] font-bold text-[20px] border rounded-md flex items-center justify-center bg-white">
                {itemQuantity}
              </span>
              <button className="flex items-center">
                <Plus
                  strokeWidth={3}
                  onClick={() => {
                    setItemQuantity(itemQuantity + 1);
                  }}
                />
              </button>
            </div>
            <a className="font-bold text-[20px] underline" href="#">
              Ver métodos de envìo disponibles
            </a>
          </div>
        </div>
      </div>
      <div className="mb-[25px] text-2xl flex flex-col gap-y-[25px]">
        <h3 className="font-bold">Descripción</h3>
        <p>{selectedProduct.description}</p>
      </div>
      <div className="bg-slate-300 px-[25px] py-[25px]">
        <h3 className="font-bold text-2xl mb-[25px]">
          Características del Producto:
        </h3>
        <ul className="flex flex-col gap-y-[21px]">
          {selectedProduct.feature.split(",").map((feature) => (
            <li key={feature} className="flex items-center gap-x-[15px]">
              <Dot size={48} strokeWidth={3} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
