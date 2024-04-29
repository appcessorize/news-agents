import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setErrorMsg(null); // Clear any previous error messages
      } catch (error) {
        setErrorMsg("Could not fetch location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      setWeatherLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
        );
        const result = await response.json();
        if (result.daily && result.daily.time.length > 1) {
          const index = result.daily.time.findIndex(
            (t) => t === new Date().toISOString().slice(0, 10)
          );
          const tomorrow = index + 1; // Assuming index is found and tomorrow exists
          let tomorrowsWeather = {
            maxTemp: result.daily.temperature_2m_max[tomorrow],
            minTemp: result.daily.temperature_2m_min[tomorrow],
            code: getWeatherDescription(result.daily.weathercode[tomorrow]),
          };
          setWeather(
            ` The weather tomorrow will be ${tomorrowsWeather.code}} with a min temp of ${tomorrowsWeather.minTemp}°C and a max temp of ${tomorrowsWeather.maxTemp}°C`
          );
        } else {
          setWeatherError("Weather data unavailable");
        }
      } catch (error) {
        setWeatherError("Failed to fetch weather");
      } finally {
        setWeatherLoading(false);
      }
    };

    if (location) {
      fetchWeather(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  const getWeatherDescription = (code) => {
    const codes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      56: "Freezing drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Light snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Heavy rain showers",
      85: "Light snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with light hail",
      99: "Thunderstorm with heavy hail",
    };
    return codes[code] || "Weather data not available";
  };

  return {
    weather,
    weatherError,
    weatherLoading,
    // return actual location object
    errorMsg,
    loading, // boolean to indicate loading state
  };
}
