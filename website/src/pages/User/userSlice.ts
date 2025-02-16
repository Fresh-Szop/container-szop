import { createAppSlice } from "@/app/createAppSlice"
import { UserData } from "@/types/API Responses"

export interface UserSliceState {
  isLoggedIn: boolean
  userData: UserData
}

const initialState: UserSliceState = {
  isLoggedIn: false,
  userData: {
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
    userId: "",
  },
}

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  reducers: create => ({
    logIn: create.reducer(state => {
      state.isLoggedIn = true
    }),
    logOut: create.reducer(state => {
      state.isLoggedIn = false
      state.userData = initialState.userData
      window.location.assign('/')
    }),
    setUserData: create.reducer((state, action: { payload: UserData }) => {
      state.userData = action.payload
      state.isLoggedIn = true
    }),
  }),
  selectors: {
    selectIsLoggedIn: user => user.isLoggedIn,
    selectUserData: user => user.userData,
  },
})

export const { logIn, logOut, setUserData } = userSlice.actions

export const { selectIsLoggedIn, selectUserData } = userSlice.selectors
