export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  SelectedHobbies: undefined;
};

export interface Hobby {
  id: number;
  name: string;
}

export interface UserHobby {
  id: number;
  hobby: Hobby;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}
