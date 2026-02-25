import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[252px] transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-32 px-4 pb-8 lg:px-8 lg:pb-8 min-h-screen animate-fade-in">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
