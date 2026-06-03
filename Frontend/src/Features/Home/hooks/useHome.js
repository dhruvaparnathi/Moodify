import { useContext } from "react";
import { HomeContext } from "../context/home.context";

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};
