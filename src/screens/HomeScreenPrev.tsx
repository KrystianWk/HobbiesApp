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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import "nativewind";

interface Hobby {
  id: number;
  name: string;
}

interface UserHobby {
  id: number;
  hobby: Hobby;
}

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

const HomeScreenPrev: React.FC = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    fetchHobbies();
    fetchUserHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      const response = await api.get("/hobbies");
      setHobbies(response.data.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać listy hobby.");
    }
  };

  const fetchUserHobbies = async () => {
    try {
      const response = await api.get("/user_hobbies", {
        params: {
          fields: ["hobby.id"],
        },
      });
      const userHobbies = response.data.data.map(
        (uh: UserHobby) => uh.hobby.id
      );
      setSelectedHobbies(userHobbies);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać wybranych hobby.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = async (hobby: Hobby) => {
    if (selectedHobbies.includes(hobby.id)) {
      // Usuń hobby z wybranych
      try {
        await api.delete("/user_hobbies", {
          params: {
            filter: {
              hobby: { _eq: hobby.id },
            },
          },
        });
        setSelectedHobbies((prev) => prev.filter((id) => id !== hobby.id));
      } catch (error) {
        console.error(error);
        Alert.alert("Błąd", "Nie udało się usunąć hobby.");
      }
    } else {
      // Dodaj hobby do wybranych
      try {
        await api.post("/user_hobbies", {
          hobby: hobby.id,
        });
        setSelectedHobbies((prev) => [...prev, hobby.id]);
      } catch (error) {
        console.error(error);
        Alert.alert("Błąd", "Nie udało się dodać hobby.");
      }
    }
  };

  const navigateToSelectedHobbies = () => {
    navigation.navigate("SelectedHobbies");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Wybierz swoje hobby:</Text>
      <FlatList
        data={hobbies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`py-2 px-4 mb-2 rounded ${
              selectedHobbies.includes(item.id) ? "bg-green-500" : "bg-blue-500"
            }`}
            onPress={() => toggleSelect(item)}>
            <Text className="text-white">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        className="mt-4 bg-purple-500 py-2 px-4 rounded"
        onPress={navigateToSelectedHobbies}>
        <Text className="text-white text-center">Zobacz Wybrane Hobby</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenPrev;
