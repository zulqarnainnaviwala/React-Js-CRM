import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../services/userApi";

//initial state of slice
const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

//get all users
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await userApi.getUsers(token);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk(
  "users/getUser",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await userApi.getUser(token, id);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const response = await userApi.updateUser(token, id, user);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const assignUsers = createAsyncThunk(
  "users/assignUsers",
  async ({ _id, users }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await userApi.assignUsers(token, _id, users);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeUsers = createAsyncThunk(
  "users/removeUsers",
  async ({ _id, users }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await userApi.removeUsers(token, _id, users);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      await userApi.deleteUser(token, userId);
      return userId;
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (userIds, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // Use Promise.all to make multiple delete requests concurrently
      await Promise.all(
        userIds.map(async (userId) => {
          await userApi.deleteUser(token, userId);
        })
      );

      return userIds;
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//create a auth slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "Getting Users...";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Users fetched successfully";
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "Getting user...";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "User fetched successfully";
        state.users.push(action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Updating user...";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "User updated successfully.";
        const { id, updatedUser } = action.payload;
        const userIndex = state.users.findIndex((user) => user._id === id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        } else {
          console.log(`User with ID ${id} not found.`);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Deleting user...";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "User deleted successfully.";
        const userId = action.payload;
        state.users = state.users.filter((user) => user._id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(assignUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Assigning users...";
      })
      .addCase(assignUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Users successfully Assigned.";
        const updatedUsers = action.payload;
        // Replace the existing users with the updated data
        state.users = state.users.map((user) => {
          const updatedUser = updatedUsers.find(
            (updated) => updated._id === user._id
          );
          return updatedUser || user; // Use updated user if found, otherwise use the original user
        });
      })
      .addCase(assignUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Error Assigning Users";
      })
      .addCase(removeUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Removing users...";
      })
      .addCase(removeUsers.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Users successfully Removed.";
        const updatedUsers = action.payload;
        // Replace the existing users with the updated data
        state.users = state.users.map((user) => {
          const updatedUser = updatedUsers.find(
            (updated) => updated._id === user._id
          );
          return updatedUser || user; // Use updated user if found, otherwise use the original user
        });
      })
      .addCase(removeUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Error Removing Users";
      })
      .addCase(deleteUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "Deleting Users...";
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Users deleted successfully.";
        const deletedUsersIds = action.payload;
        state.users = state.users.filter(
          (user) => !deletedUsersIds.includes(user._id)
        );
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
