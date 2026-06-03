import React from "react";
import "../styles/home.scss";
import { HomeProvider } from "../context/home.context";
import HomeContent from "./HomeContent";

const Home = () => {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
};

export default Home;