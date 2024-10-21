import { PermissionsAndroid, Platform } from "react-native"
import Geolocation from "react-native-geolocation-service"

export const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      },
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true
}

export const startLocationTracking = (
  setLocation: (location: { latitude: number; longitude: number }) => void,
  setIsTracking: (isTracking: boolean) => void,
) => {
  setIsTracking(true)

  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      setLocation({ latitude, longitude })
      setIsTracking(false)
    },
    (error) => {
      console.error(error.code, error.message)
      setIsTracking(false)
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  )
}

export const handleStartTracking = async (
  setLocation: (location: { latitude: number; longitude: number }) => void,
  setIsTracking: (isTracking: boolean) => void,
) => {
  const hasPermission = await requestLocationPermission()
  if (hasPermission) {
    startLocationTracking(setLocation, setIsTracking)
  } else {
    console.log("Location permission denied")
  }
}
