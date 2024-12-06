import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./src/store/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import api from "./src/services/api";
import { login } from "./src/store/slices/authSlice";
import HomeScreen from "./src/screens/HomeScreen";
import SelectedHobbiesScreen from "./src/screens/SelectedHobbiesScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { RootStackParamList } from "./src/types/types";
import "./global.css";
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Wybierz Hobby" }}
            />
            <Stack.Screen
              name="SelectedHobbies"
              component={SelectedHobbiesScreen}
              options={{ title: "Twoje Wybrane Hobby" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Logowanie" }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Rejestracja" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("access_token");
      console.log("Sprawdzanie tokena w SecureStore:", token);
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        dispatch(login(token));
      }
      setLoading(false);
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return <AppNavigator />;
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
