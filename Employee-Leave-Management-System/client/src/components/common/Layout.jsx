import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="pl-0 lg:pl-64 transition-all duration-300">
        <Navbar />
        <main className="pt-24 p-4 lg:p-8 min-h-screen animate-fade-in">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
