import React from "react";
import { Outlet } from "react-router";
import { AuthProvider } from "./Features/Auth/auth.context";

function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default App;