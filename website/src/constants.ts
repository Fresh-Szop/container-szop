import * as Yup from 'yup';
export const DICTIONARY = {
    NIP_NUM: "1234567890",
    KRS_NUM: "0000001234",
    COMPANY_ADDRESS: "",
    START: "Start",
    ABOUT_US: "O nas",
    CONTACT: "Kontakt",
    NOT_FOUND_FALLBACK: "Nie znaleziono szukanej strony",
    PRODUCT_NAME: 'Nazwa produktu',
    CATEGORY: 'Kategoria',
    UNIT_OF_MEASURE: 'Jednostka miary',
    MIN_ORDER_QUANTITY: 'Minimalna ilość zamówienia',
    FRESH_SHOP_ID: "Kod Fresh Shop",
    ADD_TO_BASKET: "Dodaj do koszyka",
    AVAILABLE_QUANTITY: "Ilość dostępna",
    REGULAR_PRICE: "Cena regularna",
    PROMO_PRICE: "Fresh cena",
    YOUR_PRICE: "Twoja cena",
    CURRENCY_CODE: "zł",
    PROMOTION: "Promocja",
    PRODUCTS: "Produkty",
    DISCOUNT: "Rabat",
    PRODUCER: "Producent",
    UNIT: "Jednostka",
    AVG_UNIT_WEIGHT: "Średnia waga jednostki",
    PRODUCTS_PURCHASED_TOGETHER: "Produkty kupowane razem",
    LOGIN_REGISTER: "Zaloguj się / załóż konto",
    LOGOUT: "Wyloguj",
    CHECKOUT: "Dostawa i płatność",
    RECIPES: "Przepisy",
    ORDERS: "Zamówienia",
    YOUR_ORDERS: "Lista twoich zamówień",
    ORDER_ID: "Numer zamówienia",
    DATE: "Data",
    STATUS: "Status",
    PRICE: "Cena",
    AMOUNT_ORDERED: "Ilość zamówiona",
    ORDER_VALUE: "Wartość zamówienia",
    CONVERT_TO_SUBSCRIPTION: "Przekształć w subskrypcję",
    NO_ADDRESSES_DEFINED: "Brak zdefiniowanych adresów dostawy",
    PLACE_ORDER: "Złóż zamówienie",
    SUBSCRIPTIONS: "Subskrypcje",
    SUBSCRIPTION_ID: "Numer subskrypcji",
    FREQUENCY: "Częstotliwość",
    YOUR_SUBSCRIPTIONS: "Lista twoich subskrypcji",
    CREATION_DATE: "Data utworzenia",
    UNIT_PRICE: "Cena jednostkowa",
}


export const AddressValidationSchema = Yup.object().shape({
    addressName: Yup.string()
        .matches(/^\S*$/, 'Nazwa adresu nie może zawierać spacji')
        .required('Nazwa adresu jest wymagana'),
    firstName: Yup.string().required('Imię jest wymagane'),
    lastName: Yup.string().required('Nazwisko jest wymagane'),
    firstAddressLine: Yup.string().required('Adres jest wymagany'),
    secondAddressLine: Yup.string().nullable(),
    postalCode: Yup.string().required('Kod pocztowy jest wymagany'),
    postalCity: Yup.string().required('Miasto jest wymagane'),
    phoneNumber: Yup.string()
        .matches(/^\d{9}$/, 'Numer telefonu musi mieć format xxx-xxx-xxx')
        .required('Numer telefonu jest wymagany'),
});

export const AVAILABLE_FILTERS = ['category', 'isSeason', 'discount', 'price-min', 'price-max', 'order', 'page-size']
