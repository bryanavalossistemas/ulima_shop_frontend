import { useNavigate } from "react-router-dom";

export default function CheckOutButton() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end">
      <button
        className="mt-4 bg-slate-700 text-white h-[60px] w-[200px] rounded-md mb-24"
        onClick={() => navigate("/checkout")}
      >
        Checkout
      </button>
    </div>
  );
}
