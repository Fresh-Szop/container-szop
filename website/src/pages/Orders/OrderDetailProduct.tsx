import { DICTIONARY } from "@/constants";
import { OrderItem } from "@/types/Basket";

export const OrderDetailProduct = ({ product }: { product: OrderItem }) => {
    return (
        <div className="flex gap-8 items-center text-2xl">
            <div className="flex items-center">
                <img width={120} src={`src/img/vegetables/${product.productId}.webp`}
                    className="rounded-2xl "
                    alt={product.name} />

            </div>
            <div className="flex w-full">
                <div className="flex gap-4 flex-col w-1/3">
                    <div className="flex gap-4">
                        <span>{DICTIONARY.PRODUCT_NAME}: </span><span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="flex gap-4">
                        <span>{DICTIONARY.PRODUCER}: <span className="font-semibold">{product.producer}</span></span>
                    </div>
                </div>
                <div className="flex items-center w-1/3 gap-4">
                    <div>
                        <span>{DICTIONARY.AMOUNT_ORDERED}: </span> <span className="font-semibold ">{product.basketQuantity} {product.unit}</span>
                    </div>
                </div>
                <div className="flex items-center flex-col justify-end w-1/3 gap-4">
                    <div className="flex gap-4 justify-end w-full">
                        <span>{DICTIONARY.UNIT_PRICE}: </span> <span className="font-semibold ">{product.basePrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                    </div>
                    {product.finalDiscountedPrice !== product.finalBasePrice && (
                        <>
                            <div className="flex gap-4 justify-end w-full">
                                <span>{DICTIONARY.REGULAR_PRICE}: </span> <span className="font-semibold ">{product.finalBasePrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                            </div>
                            <div className="flex gap-4 justify-end w-full text-blood-4 font-bold">
                                <span>{DICTIONARY.YOUR_PRICE}: </span> <span className="font-semibold ">{product.finalDiscountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                            </div>
                        </>
                    )}
                    {product.finalDiscountedPrice === product.finalBasePrice && (
                        <div className="flex gap-4 justify-end w-full">
                            <span>{DICTIONARY.YOUR_PRICE}: </span> <span className="font-semibold ">{product.finalDiscountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}