import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="min-w-fit flex flex-col gap-y-8 bg-white p-8 rounded-md">
      <h2 className="font-medium text-lg">Mi Cuenta</h2>
      <ul className="flex flex-col gap-y-6 pl-6">
        <li>
          <Link to={"/user/account"}>Órdenes Recientes</Link>
        </li>
        <li>
          <Link to={"/user/registration_data"}>Datos de Registro</Link>
        </li>
        <li>
          <Link to={"/user/change_password"}>Cambiar Password</Link>
        </li>
      </ul>
    </div>
  );
}
