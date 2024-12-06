import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import api, { authApi } from "../services/api";
import * as SecureStore from "expo-secure-store";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import "nativewind";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      console.log("Wysyłanie żądania do /auth/login");
      const response = await authApi.post("/auth/login", { email, password });
      const { access_token } = response.data.data;

      await SecureStore.setItemAsync("access_token", access_token);
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      dispatch(login(access_token));
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Błąd", "Nie udało się zalogować.");
    }
  };
  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4 text-center">Logowanie</Text>
      <TextInput
        className="bg-white p-2 mb-4 rounded"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-white p-2 mb-4 rounded"
        placeholder="Hasło"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-blue-500 py-2 px-4 rounded"
        onPress={handleLogin}>
        <Text className="text-white text-center">Zaloguj się</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={navigateToRegister}>
        <Text className="text-blue-500 text-center">
          Nie masz konta? Zarejestruj się
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
