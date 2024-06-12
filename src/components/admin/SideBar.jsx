import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="min-w-fit flex flex-col gap-y-8 bg-white p-8 rounded-md">
      <h2 className="font-medium text-lg">Admin</h2>
      <ul className="flex flex-col gap-y-6 pl-6">
        <li>
          <Link to={"#"}>Dashboard</Link>
        </li>
        <li>
          <Link to={"/admin/users"}>Usuarios registrados</Link>
        </li>
        <li>
          <Link to={"/admin/products"}>Productos</Link>
        </li>
        <li>
          <Link to={"/admin/orders"}>Órdenes</Link>
        </li>
        <li>
          <Link to={"#"}>Productos más vendidos</Link>
        </li>
        <li>
          <Link to={"/admin/series"}>Series</Link>
        </li>
      </ul>
    </div>
  );
}
