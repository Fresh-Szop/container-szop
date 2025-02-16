import { createAppSlice } from "@/app/createAppSlice"
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { AllProductsResponse } from "@/types/API Responses"
import axios from "axios"

export interface FiltersSliceState {
  products: AllProductsResponse | null
  maxPages: number | null
  currentPage: number | null
}

const initialState: FiltersSliceState = {
  products: null,
  maxPages: null,
  currentPage: null,
}

// Thunk do pobierania produktów
export const fetchAllProductsThunk = createAsyncThunk(
  "filters/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log(import.meta.env.VITE_GATEWAY)
      console.log(import.meta.env)

      const urlParams = new URLSearchParams(window.location.search)
      const response = await axios.get(
        `${import.meta.env.VITE_GATEWAY}/products?${urlParams.toString()}`,
        {withCredentials: true},
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  },
)

export const filtersSlice = createAppSlice({
  name: "filters",
  initialState,
  reducers: create => ({
    resetProducts: create.reducer(state => {
      state.products = null
    }),
  }),
  extraReducers: builder => {
    builder.addCase(fetchAllProductsThunk.fulfilled, (state, action) => {
      state.products = action.payload
      state.maxPages = action.payload.pages.lastPage
      state.currentPage = action.payload.pages.currentPage
    })
  },
  selectors: {
    selectFiltersState: filters => filters,
    selectProducts: filters => filters.products,
    selectMaxPages: filters => filters.maxPages,
    selectCurrPage: filters => filters.currentPage,
  },
})

export const { resetProducts } = filtersSlice.actions
export const {
  selectFiltersState,
  selectProducts,
  selectMaxPages,
  selectCurrPage,
} = filtersSlice.selectors
export default filtersSlice.reducer
