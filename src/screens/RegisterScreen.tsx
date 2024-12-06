import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import api from "../services/api";
import "nativewind";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
type LoginScreenNavigationProp = NavigationProp<RootStackParamList, "Login">;

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleRegister = async () => {
    try {
      await api.post("/users", {
        email,
        password,
      });
      Alert.alert(
        "Sukces",
        "Rejestracja przebiegła pomyślnie. Możesz się teraz zalogować."
      );
      navigation.navigate("Login");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      Alert.alert("Błąd", "Nie udało się zarejestrować. Spróbuj ponownie.");
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4 text-center">Rejestracja</Text>
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
        onPress={handleRegister}>
        <Text className="text-white text-center">Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
