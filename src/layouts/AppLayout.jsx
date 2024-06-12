import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster position="bottom-center" />
      <Footer />
    </>
  );
}
