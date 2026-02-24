import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="lg:pl-[252px] transition-all duration-300">
        <Navbar />
        <main className="pt-28 px-4 pb-8 lg:px-8 lg:pb-8 min-h-screen animate-fade-in">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
