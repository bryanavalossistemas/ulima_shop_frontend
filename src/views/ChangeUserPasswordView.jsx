import SideBar from "@/components/shop/SideBar";
import TopBar from "@/components/admin/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import Input from "@/components/auth/Input";
import { toast } from "sonner";
import ErrorDisplay from "@/components/auth/ErrorDisplay";

export default function ChangeUserPasswordView() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setError("Las contraseñas no son iguales");
      return;
    }

    const response = await fetch(
      `http://localhost:4000/api/users/${currentUser.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
        }),
      }
    );

    if (response.ok) {
      toast.success("Usuario actualizado correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } else {
      toast.error("Error al actualizar usuario");
    }
  }

  function verifySession() {
    if (!currentUser) {
      navigate("/auth/login");
    }
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
            <TopBar text="Cambiar Password" />
            <div className="flex pt-10 justify-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-y-4 w-96"
              >
                <Input
                  required
                  placeholder="Actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  required
                  placeholder="Nuevo"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  required
                  type="repeatPassword"
                  placeholder="Repetir"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {error !== "" && <ErrorDisplay text={error} />}
                <Button className="py-8 text-base" type="submit">
                  Cambiar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
