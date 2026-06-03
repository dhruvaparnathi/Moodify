import React from "react";
import { Music2, User, LogOut } from "lucide-react";
import { useHome } from "../hooks/useHome";

const FloatingNav = () => {
  const { user, logout, scrollToSection } = useHome();

  return (
    <nav className="floating-nav-top">
      <div className="logo-pill" onClick={() => scrollToSection("section-hero")}>
        <div className="icon-music">
          <Music2 size={16} color="#181818" strokeWidth={3} />
        </div>
        <span>MOODIFY</span>
      </div>

      <div className="user-profile-pill">
        <div className="user-info">
          <User size={14} color="#181818" strokeWidth={2.5} />
          <span>{user?.username}</span>
        </div>
        <button onClick={logout} className="logout-btn-pill" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

export default FloatingNav;
