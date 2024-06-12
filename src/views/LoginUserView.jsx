import { useState } from "react";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import { Link, useNavigate } from "react-router-dom";
import Heading from "@/components/auth/Heading";
import Input from "@/components/auth/Input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";

export default function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      toast.success("Usuario logueado correctamente");
      const user = await response.json();
      setCurrentUser(user);
      navigate("/checkout");
    } catch (error) {
      setError("Error al loguear usuario");
      toast.error("Error al loguear usuario");
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-col justify-center items-center gap-y-8 max-w-xs mx-auto">
        <Heading text="Ingreso para clientes registrados" />
        <form onSubmit={login} className="flex flex-col gap-y-4 w-full">
          <Input
            required
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            minLength={8}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error !== "" && <ErrorDisplay text={error} />}
          <Button className="py-8 text-base" type="submit">
            Ingresar
          </Button>
        </form>
        <div className="flex flex-col justify-center items-center gap-y-4">
          <Link className="underline" to={"/auth/register"}>
            Olvide mi password
          </Link>
          <Link className="underline" to={"/auth/register"}>
            No tengo cuenta, deseo registrarme
          </Link>
        </div>
      </div>
    </main>
  );
}
