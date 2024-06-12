import Input from "@/components/auth/Input";
import Heading from "@/components/auth/Heading";
import { useState } from "react";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterUserView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("Las contraseñas no son iguales");
      return;
    }

    const response = await fetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        active: true,
      }),
    });

    if (response.ok) {
      toast.success("Usuario creado correctamente");
      navigate("/auth/login");
    } else {
      toast.error("Error al crear usuario");
    }
  }

  return (
    <main className="p-8">
      <div className="flex flex-col justify-center items-center gap-y-8 max-w-md mx-auto">
        <Heading text="Registra una nueva cuenta" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
          <Input
            required
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            required
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            required
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            required
            type="password"
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {error !== "" && <ErrorDisplay text={error} />}
          <Button
            className="py-8 text-base"
            type="submit"
          >
            Crear Nueva Cuenta
          </Button>
        </form>
      </div>
    </main>
  );
}
