import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { Hobby } from "../../types/types";

interface SelectedHobby {
  hobbyId: number;
  userHobbyId: string;
}

export interface HobbyState {
  hobbies: Hobby[];
  selectedHobbies: SelectedHobby[];
  loading: boolean;
}

const initialState: HobbyState = {
  hobbies: [],
  selectedHobbies: [],
  loading: false,
};

export const fetchHobbies = createAsyncThunk("hobby/fetchHobbies", async () => {
  try {
    const [hobbiesResponse, userHobbiesResponse] = await Promise.all([
      api.get("/hobbies"),
      api.get("/user_hobbies", {
        params: {
          filter: {
            user: { _eq: "$CURRENT_USER" },
          },
        },
      }),
    ]);

    console.log("Hobbies Response:", hobbiesResponse.data);
    console.log("User Hobbies Response:", userHobbiesResponse.data);

    const hobbies = hobbiesResponse.data.data;
    const userHobbies = userHobbiesResponse.data.data.map((uh: any) => ({
      hobbyId: uh.hobby.id,
      userHobbyId: uh.id,
    }));

    return { hobbies, userHobbies };
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    throw error;
  }
});

const hobbySlice = createSlice({
  name: "hobby",
  initialState,
  reducers: {
    addHobby(state, action: PayloadAction<SelectedHobby>) {
      state.selectedHobbies.push(action.payload);
    },
    removeHobby(state, action: PayloadAction<number>) {
      state.selectedHobbies = state.selectedHobbies.filter(
        (sh) => sh.hobbyId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHobbies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHobbies.fulfilled, (state, action) => {
        state.hobbies = action.payload.hobbies;
        state.selectedHobbies = action.payload.userHobbies;
        state.loading = false;
      })
      .addCase(fetchHobbies.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addHobby, removeHobby } = hobbySlice.actions;
export default hobbySlice.reducer;
