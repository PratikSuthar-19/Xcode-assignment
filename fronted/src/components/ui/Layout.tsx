import React from "react";
import HeaderBar from "./HeaderBar";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();

  // Hide header on login/signup pages (optional)
  const hideHeader = ["/login", "/signup"].includes(location.pathname);

  return (
    // <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-950 text-white" >
      <div className="min-h-screen bg-black text-white" >
      {!hideHeader && <HeaderBar />}
      {/* <main className="pt-30 px-4 md:px-8"> */}
       <main
        className="
          pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36
          px-4 md:px-10 lg:px-16
          transition-all duration-300
        "
      >
        <Outlet /> {/* This renders the page content */}
      </main>
    </div>
  );
};

export default Layout;