import React from "react";
import { useNavigate } from "react-router-dom"

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                 w-[100%] max-w-7xl backdrop-blur-md bg-white/10 
                 border border-white/20 rounded-4xl 
                 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                 flex items-center justify-between px-9 py-6
                 text-white transition-all duration-300 "
    >
   
      <h1 className="text-lg md:text-xl font-semibold tracking-wide">
        Welcome to{" "}
        <span className="text-orange-400 font-bold">Xcode Technologies</span>
      </h1>

    
      <div className="flex items-center gap-4" > 
         {isLoggedIn && (
          <button
            onClick={() => navigate("/create-media")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
          >
             Add
          </button>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/60 hover:bg-red-500/80 
                       text-white rounded-xl font-medium text-sm 
                       shadow-md hover:shadow-lg transition-all duration-200"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500/60 hover:bg-blue-500/80 
                       text-white rounded-xl font-medium text-sm 
                       shadow-md hover:shadow-lg transition-all duration-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
