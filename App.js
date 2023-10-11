import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import axios from "axios";

export default function App() {

  const [coordinate, setCoordinate] = useState({ latitude: 0, longitude: 0 });
  const [address, setAddress] = useState(null);

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoordinate({ latitude, longitude });

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);

      if (response.data) {
        const { address } = response.data;
        if (address) {
          const { road, postcode, city, state, country, house_number } = address;
          const fullAddress = `${road || ""}, ${house_number || ""}, ${postcode || ""}, ${city || ""}, ${state || ""}, ${country || ""}`;
          setAddress(fullAddress);
        } else {
          setAddress("Informações de endereço não encontradas");
        }
      } else {
        setAddress("Informações de endereço não encontradas");
      }
    } catch (error) {
      console.error("Erro ao obter informações de endereço:", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {coordinate.latitude !== 0 && coordinate.longitude !== 0 && (
          <Marker
            coordinate={coordinate}
            title="Localização"
            description={`Latitude: ${coordinate.latitude}, Longitude: ${coordinate.longitude}`}
          />
        )}
      </MapView>
      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>Endereço: {address}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "70%",
  },
  addressContainer: {
    backgroundColor: "white",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
