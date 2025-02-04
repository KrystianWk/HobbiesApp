import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../services/api";
import "nativewind";
import { Hobby, UserHobby } from "../types/types";
import { useNavigation } from "@react-navigation/native"; // Dodaj import

const SelectedHobbiesScreen: React.FC = () => {
  const [selectedHobbies, setSelectedHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation(); // Zainicjuj nawigację

  useEffect(() => {
    fetchSelectedHobbies();
  }, []);

  const fetchSelectedHobbies = async () => {
    try {
      const response = await api.get("/user_hobbies", {
        params: {
          fields: ["hobby.*"],
        },
      });
      const hobbies = response.data.data.map((uh: UserHobby) => uh.hobby);
      setSelectedHobbies(hobbies);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać wybranych hobby.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (selectedHobbies.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Nie wybrano żadnych hobby.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-12 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Twoje Wybrane Hobby:</Text>
      <FlatList
        data={selectedHobbies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="py-2 px-4 mb-2 bg-green-500 rounded">
            <Text className="text-white">{item.name}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        className="mt-4 bg-blue-500 py-2 px-4 rounded"
        onPress={() => navigation.goBack()}>
        <Text className="text-white text-center">Wróć do wyboru hobby</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectedHobbiesScreen;
