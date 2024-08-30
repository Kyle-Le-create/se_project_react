import "./WeatherCard.css";
import sunny from "../../assets/day/sunny.svg";

function WeatherCard({ weatherData }) {
  console.log(weatherData);
  return (
    <section className="weather-card">
      <p className="weather-card__temp">{weatherData.temp.F} &deg; F</p>
      <img src={sunny} alt="sunny" className="weather-card__image" />
    </section>
  );
}

export default WeatherCard;
