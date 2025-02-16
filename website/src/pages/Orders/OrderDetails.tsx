import { useParams } from "react-router-dom"
import { OrderDetailProduct } from "./OrderDetailProduct"
import { DICTIONARY } from "@/constants"
import { OrderStatus } from "@/types/Dictionaries"
import { useFetchOrder } from "@/api/hooks/useFetchOrder"
import { DNA } from "react-loader-spinner"
import { OrderItem } from "@/types/Basket"
import { formatDate } from '../../api/utils/dateFormatter';

export const OrderDetails = () => {
    const { id } = useParams<{ id: string }>()
    const orderID = parseInt(id || "", 10)

    const { data, isLoading } = useFetchOrder(orderID);

    return (
        <div className="max-w-128 w-full bg-malachite-0 p-4 rounded-2xl text-2xl flex flex-col flex-grow gap-8 my-4">
            <span className="font-bold text-3xl flex justify-center">Szczegóły zamówienia</span>
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            {data &&
                <>
                    <div className="flex flex-col gap-4 border-2 border-malachite-5 rounded-2xl p-8">
                        <div className="flex gap-4">
                            <span>{DICTIONARY.ORDER_ID}:</span>
                            <span className="font-bold">{orderID}</span>
                        </div>
                        <div className="flex gap-4">
                            <span>{DICTIONARY.DATE} zamówienia:</span>
                            <span className="font-bold">{formatDate(data.updateDate)}</span>
                        </div>
                        <div className="flex gap-4">
                            <span>{DICTIONARY.STATUS}:</span>
                            <span className={`font-bold ${data.status === 'delivered' ? "text-malachite-4 font-bold" : ""}
                            ${data.status === 'sent' ? "text-desertsand-4 font-bold" : ""}`}>{OrderStatus[data.status as keyof typeof OrderStatus]}</span>
                        </div>
                        <div className="flex gap-4">
                            <span>{DICTIONARY.ORDER_VALUE}:</span>
                            <span className="font-bold">{data.finalDiscountedPrice.toFixed(2)} zł</span>
                        </div>

                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-3xl">Produkty</span>
                        <div className="flex flex-col gap-4">
                            {data.products.map((product: OrderItem) => (
                                <OrderDetailProduct key={product.productId} product={product} />
                            ))}
                        </div>
                        <div className="w-full flex justify-end gap-4">{DICTIONARY.ORDER_VALUE}: <span className="font-bold">{data.finalDiscountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span></div>
                    </div>
                </>
            }
        </div>
    )
}