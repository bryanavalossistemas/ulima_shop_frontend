import FilterProductItem from "@/components/shop/FilterProductItem";
import { useStore } from "@/store";
import { useState } from "react";

export default function ResultsView() {
  const filteredProducts = useStore((state) => state.filteredProducts);
  const orderFilteredProductsByPrice = useStore(
    (state) => state.orderFilteredProductsByPrice
  );
  const orderFilteredProductsByBrand = useStore(
    (state) => state.orderFilteredProductsByBrand
  );
  const [selectedFilter, setSelectedFilter] = useState(0);

  function handleChange(e) {
    setSelectedFilter(+e.target.value);
    if (e.target.value === "1") {
      orderFilteredProductsByPrice();
    } else {
      orderFilteredProductsByBrand();
    }
  }

  return (
    <main className="pt-[11px] px-10 pb-[51px] text-2xl">
      <div className="flex justify-end gap-x-4 items-center mb-[11px]">
        <label className="font-bold" htmlFor="orderBy">
          Ordernar Por:
        </label>
        <select
          value={selectedFilter}
          onChange={handleChange}
          className="text-slate-600 h-[46px] border border-slate-600 w-[243px] px-5 flex items-center rounded-md"
          name="orderBy"
          id="orderBy"
        >
          <option disabled value={0}>
            -- Filtrar por --
          </option>
          <option value={1}>Precio</option>
          <option value={2}>Marca</option>
        </select>
      </div>

      <div className="h-[52px] bg-slate-300 rounded-md flex items-center border border-slate-500 px-[22px] mb-[15px]">
        <h1 className="font-bold">Resultados de Búsqueda</h1>
      </div>

      <div className="space-y-[23px] mb-[51px]">
        {filteredProducts.map((product) => (
          <FilterProductItem key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
