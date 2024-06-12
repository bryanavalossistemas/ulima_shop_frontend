import SideBar from "@/components/shop/SideBar";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import Input from "@/components/auth/Input";
import { toast } from "sonner";

export default function RegistrationDataView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:4000/api/users/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      }
    );

    if (response.ok) {
      setCurrentUser(await response.json());
      toast.success("Usuario actualizado correctamente");
    } else {
      toast.error("Error al actualizar usuario");
    }
  }

  function verifySession() {
    if (!currentUser) {
      navigate("/auth/login");
    }
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setEmail(currentUser.email);
  }

  useEffect(() => {
    verifySession();
  }, []);

  return (
    <main className="p-10">
      <div className="flex gap-x-8">
        <SideBar />
        <div className="flex-grow flex flex-col">
          <div className="flex flex-col">
            <TopBar text="Datos de Registro" />
            <div className="flex pt-10 justify-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-y-4 w-96"
              >
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
                {error !== "" && <ErrorDisplay text={error} />}
                <Button className="py-8 text-base" type="submit">
                  Actualizar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
