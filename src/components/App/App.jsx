import { useState } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";

function App() {
  const [weatherData, setWeatherData] = useState({ type: "cold" });

  return (
    <div className="page">
      <div className="page__content">
        <Header />
        <Main weatherData={weatherData} />
      </div>
      <ModalWithForm />
    </div>
  );
}

export default App;
