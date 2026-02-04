import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainBackground from "@/components/MainBackground";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <MainBackground>
      <Header />
      <Outlet />
      <Footer />
    </MainBackground>
  );
}

export default MainLayout;
