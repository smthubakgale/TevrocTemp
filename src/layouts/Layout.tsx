import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AsideMenu from "../components/AsideMenu";
import React from "react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F6F4F1]">
      <Navbar />
      <AsideMenu />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
