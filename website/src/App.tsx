import "./App.css"
import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/HomePage/HomePage"
import { NotFound404 } from "./pages/404/NotFound404"
import { Footer } from "./components/Footer"
import { Menu } from "./components/Menu"
import { Product } from "./pages/Product/Product"
import { ContactForm } from "@/pages/ContactForm/ContactForm"
import ProductListing from "@/pages/ProductListing/ProductListing"
import { LoginForm } from "@/pages/Login/LoginForm"
import { useAppSelector } from "./app/hooks"
import { selectIsLoggedIn } from "@/pages/User/userSlice"
import { BasketBar } from "./components/ui/BasketBar"
import { Basket } from "./pages/Basket/Basket"
import { ToastContainer } from "react-toastify"
import { Recipes } from "./pages/Recipes/Recipes"
import { RecipeDetails } from "./pages/Recipes/RecipeDetails"
import { UserProfile } from "./pages/UserProfile/UserProfile"
import { Orders } from "./pages/Orders/Orders"
import { OrderDetails } from "./pages/Orders/OrderDetails"
import { DebugComponent } from "./components/DebugComponent"
import { OrderSummary } from "./pages/OrderSummary/OrderSummary"
import { ThankYou } from "./pages/ThankYouPage/ThankYou"
import { Subscriptions } from "./pages/Subscriptions/Subscriptions"
import { SubscriptionDetails } from "./pages/Subscriptions/SubscriptionDetails"


const App = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  return (
    <>
      <DebugComponent />
      <ToastContainer autoClose={5000} draggable pauseOnHover theme="colored" style={{ fontSize: "1.6rem" }} position="bottom-right" />
      <Menu />
      {isLoggedIn && <BasketBar />}
      {!isLoggedIn && <div className="h-4" />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound404 />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:productID" element={<Product />} />
        <Route path="/recipe/:recipeID" element={<RecipeDetails />} />
        <Route path={"/contact-form"} element={<ContactForm />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"/basket"} element={<Basket />} />
        <Route path={"/basket/summary"} element={<OrderSummary />} />
        <Route path={"/recipes"} element={<Recipes />} />
        <Route path={"/user-profile"} element={<UserProfile />} />
        <Route path={"/orders"} element={<Orders />} />
        <Route path={"/order/:id"} element={<OrderDetails />} />
        <Route path={"/order-placed/:id"} element={<ThankYou />} />
        <Route path={"/subscriptions"} element={<Subscriptions />} />
        <Route path={"/subscription/:id"} element={<SubscriptionDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
