import { ProductCard } from "@/components/ProductCard";
import { DICTIONARY } from "@/constants";
import { useBasketStore } from "@/stores/BasketStore";
import { BasketItem } from "@/types/Basket";
import { RefreshCcw, ShoppingCart } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { ConvertToSubscriptionModal } from "./ConvertToSubscriptionModal";



export const Basket = () => {
    const { basketList, basketSummary } = useBasketStore();
    const notify = () => toast.error("😥 Ficzer jeszcze nie działa! 😱 Basket.tsx : 43");
    const redirectToCheckout = () => {
        window.location.href = "/basket/summary";
    }

    return (
        <div className="flex flex-grow max-w-128 w-full my-4 gap-4">
            <div className="flex flex-col gap-4 w-full">
                <span className="text-4xl font-bold">Twój koszyk</span>
                {basketList ? (
                    <div className="flex flex-col w-full gap-4">
                        {basketList.map((basketItem: BasketItem) => {
                            return (
                                <ProductCard key={basketItem.productId} data={basketItem} isBasket={true} />

                            );
                        })}
                    </div>
                ) : (
                    <span className="text-2xl">Brak produktów w koszyku</span>
                )}
            </div>
            {basketSummary && (
                <div className="bg-malachite-0 rounded-2xl p-8 flex flex-col gap-8 min-w-[31rem] w-fit">
                    <span className="text-4xl font-bold">Podsumowanie</span>
                    <div className="text-3xl flex justify-between w-full gap-4">
                        <span>Łączna&nbsp;wartość: </span>
                        <span>{basketSummary.finalBasePrice}&nbsp;zł</span>
                    </div>
                    <div className="text-3xl text-blood-4 font-bold flex justify-between w-full">
                        <span>Wartość&nbsp;z&nbsp;rabatem: </span>
                        <span>{basketSummary.finalDiscountedPrice}&nbsp;zł</span>
                    </div>
                    <button onClick={redirectToCheckout} className="text-2xl rounded-2xl font-bold flex items-center gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all">
                        <ShoppingCart /> {DICTIONARY.CHECKOUT}
                    </button>
                    <ConvertToSubscriptionModal />
                </div>
            )}

        </div>
    );
}