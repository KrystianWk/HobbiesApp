import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <View className="bg-blue-500 p-4 flex-row justify-between items-center">
      <Text className="text-white text-xl font-bold">{title}</Text>
    </View>
  );
};

export default Header;
