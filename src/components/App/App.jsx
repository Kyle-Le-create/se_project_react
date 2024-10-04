import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey, clothingItems } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import Profile from "../Profile/Profile";
import { filterWeatherData, getWeather } from "../../utils/weatherApi";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, removeItem, addItem } from "../../utils/api";
import DeleteModal from "../DeleteModal/DeleteModal";
// import Register from "../RegisterModal/RegisterModal";
// import Login from "../LoginModal/LoginModal";
// import * as auth from "../../utils/auth";
// import CurrentUserContext from "../../contexts/CurrentUserContext";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999 },
    city: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    link: "",
    weather: "",
  });
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    avatar: "",
    _id: "",
  });
  console.log(currentUser);
  const handleRegistration = ({ name, email, password, avatar }) => {
    return auth
      .register(name, password, email, avatar)
      .then(() => {
        handleLogin({ email, password });
        closeActiveModal();
      })
      .catch(console.error);
  };
  const handleLogin = ({ email, password }) => {
    if (!email || !password) {
      return;
    }
    return auth
      .authorize(email, password)
      .then((data) => {
        console.log(data);
        if (data.token) {
          setToken(data.token);
          api.getUserInfo(data.token).then((userData) => {
            setCurrentUser(userData);
            setIsLoggedIn(true);
            closeActiveModal();
            navigate("/profile");
          });
        }
      })
      .catch(console.error);
  };

  const handleCardClick = (item) => {
    setActiveModal("preview");
    setSelectedCard(item);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleDeleteCardClick = () => {
    setActiveModal("delete-confirmation");
  };

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTemperatureUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTemperatureUnit("C");
  };

  const handleAddItemSubmit = (item) => {
    return addItem(item).then((newItem) => {
      setClothingItems([newItem, ...clothingItems]);
      closeActiveModal();
    });
  };

  const handleCardDelete = (card) => {
    removeItem(card._id)
      .then(() => {
        setClothingItems((cards) => cards.filter((c) => c._id !== card._id));
        setSelectedCard({});
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filterData = filterWeatherData(data);
        setWeatherData(filterData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then(({ items }) => {
        setClothingItems(items.reverse);
      })
      .catch(console.error);
  }, []);

  const handleLoginClick = () => {
    setActiveModal("login");
  };
  const handleSignUpClick = () => {
    setActiveModal("register");
  };

  return (
    <div className="page">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  handleCardClick={handleCardClick}
                  handleAddClick={handleAddClick}
                  clothingItems={clothingItems}
                />
              }
            />
          </Routes>
          <Footer />
        </div>
        {/* <Login
          isOpen={activeModal === "login"}
          onClose={closeActiveModal}
          onLogin={handleLoginClick}
          handleLogin={handleLogin}
          setActiveModal={setActiveModal}
        />
        <Register
          isOpen={activeModal === "register"}
          onClose={closeActiveModal}
          onSignup={handleSignUpClick}
          handleRegistration={handleRegistration}
          setActiveModal={setActiveModal}
        /> */}
        <AddItemModal
          onClose={closeActiveModal}
          isOpen={activeModal === "add-garment"}
          onAddItem={handleAddItemSubmit}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          openConfirmationModal={handleDeleteCardClick}
        />
        {/* <EditProfileModal
          onClose={closeActiveModal}
          isOpen={activeModal === "edit-profile"}
          onEditProfile={handleEditProfile}
        /> */}
        <DeleteModal
          activeModal={activeModal}
          onClose={closeActiveModal}
          handleCardDelete={handleCardDelete}
          selectedCard={selectedCard}
        />
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
