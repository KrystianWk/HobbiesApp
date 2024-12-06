import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { RootStackParamList, Hobby } from "../types/types";
import {
  addHobby,
  removeHobby,
  fetchHobbies,
} from "../store/slices/hobbySlice";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { logout } from "../store/slices/authSlice";

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { hobbies, selectedHobbies, loading } = useSelector(
    (state: RootState) => state.hobby
  );

  useEffect(() => {
    dispatch(fetchHobbies());
  }, [dispatch]);

  const toggleSelect = async (hobbyId: number) => {
    try {
      console.log("Selected hobby ID:", hobbyId);

      const selectedHobby = selectedHobbies.find(
        (sh) => sh.hobbyId === hobbyId
      );

      if (selectedHobby) {
        console.log("Removing hobby:", selectedHobby);

        const deleteResponse = await api.delete(
          `/user_hobbies/${selectedHobby.userHobbyId}`
        );
        console.log("Delete Response:", deleteResponse.data);

        dispatch(removeHobby(hobbyId));
      } else {
        console.log("Adding hobby:", hobbyId);

        const postResponse = await api.post("/user_hobbies", {
          hobby: hobbyId,
        });
        console.log("Post Response:", postResponse.data);

        const newUserHobbyId = postResponse.data.data.id;

        dispatch(addHobby({ hobbyId, userHobbyId: newUserHobbyId }));
      }
    } catch (error) {
      console.error(
        "Błąd podczas aktualizacji hobby:",
        error.response?.data || error
      );
      Alert.alert("Błąd", "Nie udało się zaktualizować hobby.");
    }
  };

  const navigateToSelectedHobbies = () => {
    navigation.navigate("SelectedHobbies");
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("access_token");
      delete api.defaults.headers.Authorization;
      dispatch(logout());
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out.");
    }
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
      <Text className="text-2xl font-bold">Wybierz swoje hobby:</Text>

      <FlatList
        data={hobbies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`py-2 px-4 mb-2 rounded ${
              selectedHobbies.some((sh) => sh.hobbyId === item.id)
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            onPress={() => toggleSelect(item.id)}>
            <Text className="text-white">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        className="mt-4 bg-purple-500 py-2 px-4 rounded"
        onPress={navigateToSelectedHobbies}>
        <Text className="text-white text-center">Zobacz Wybrane Hobby</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 bg-red-500 py-2 px-4 rounded"
        onPress={handleLogout}>
        <Text className="text-white text-center">Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
