import axios from 'axios';
import { AllProductsResponse } from "@/types/API Responses";

export const fetchAllProducts = async (): Promise<AllProductsResponse | undefined> => {
  // Pobierz parametry zapytania z URL
  const urlParams = new URLSearchParams(window.location.search);

  try {
    // Wyślij żądanie do endpointu z tymi samymi parametrami
    const response = await axios.get(`${import.meta.env.VITE_GATEWAY}/products?${urlParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products: ', error);
  }
};
