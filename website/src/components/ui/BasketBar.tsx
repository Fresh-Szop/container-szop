import { ShoppingBasket } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import logo from "../../img/fresh-shop-logo.png"
import { useBasketStore } from "@/stores/BasketStore"

export const BasketBar = () => {
    const { basketSummary } = useBasketStore();
    const location = useLocation()
    const justifyType = location.pathname !== "/" ? "justify-between" : "justify-end"
    return (

        <div className={`flex ${justifyType} max-w-128 w-full`}>

            <div className="h-[96px] max-w-128 w-full flex mt-[-5px]">
                <div className={"w-full bg-[url(../src/img/banner2.jpg)] bg-cover mr-4 rounded-bl-3xl rounded-br-3xl"}>
                    <div className="h-full w40 ">
                        <img src={logo} className=" h-full w-auto" alt="logo" />
                    </div>
                </div>
            </div>

            <Link to="/basket" title='Przejdź do koszyka'>
                <div className="bg-verdigris-2 p-4 items-center  flex flex-col gap-4 rounded-bl-3xl border-4 border-verdigris-2 rounded-br-3xl mt-[-6px] relative hover:border-verdigris-4 hover:cursor-pointer transition-all">
                    <button><ShoppingBasket size={40} />
                        {basketSummary?.basketQuantity && (
                            <span className="absolute top-5 right-7 bg-blood-4 text-white rounded-full w-8 h-8 flex justify-center items-center">{basketSummary?.basketQuantity}</span>)}
                    </button>
                    {basketSummary && <span className="font-bold text-2xl">{basketSummary?.finalDiscountedPrice.toFixed(2)}&nbsp;zł</span>}
                    {!basketSummary && <span className="font-bold text-2xl">0.00&nbsp;zł</span>}
                </div>
            </Link>
        </div>

    )
}