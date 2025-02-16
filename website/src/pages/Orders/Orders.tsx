import { useFetchAllOrders } from "@/api/hooks/useFetchAllOrders"
import { DICTIONARY } from "@/constants"
import { Order } from "@/types/API Responses"
import { OrderStatus } from "@/types/Dictionaries"
import { DNA } from "react-loader-spinner"
import { formatDate } from '../../api/utils/dateFormatter';

export const Orders = () => {
    const { data: ordersList, isLoading } = useFetchAllOrders()

    const handleOrderClick = (orderId: number) => {
        window.location.assign(`/order/${orderId}`)
    }
    return (
        <div className="max-w-128 w-full my-4 rounded-2xl p-4 bg-malachite-0 flex flex-col flex-grow text-2xl gap-8">
            <span className="flex w-full justify-center text-3xl font-bold">{DICTIONARY.YOUR_ORDERS}</span>
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            <div className="flex flex-col gap-4 border-2 border-malachite-5 rounded-2xl p-8">
                <div className="flex gap-4">
                    <span className="w-1/4 text-center">{DICTIONARY.ORDER_ID}</span>
                    <span className="w-1/4 text-center">{DICTIONARY.DATE}</span>
                    <span className="w-1/4 text-center">{DICTIONARY.STATUS}</span>
                    <span className="w-1/4 text-center">{DICTIONARY.PRICE}</span>
                </div>
                {ordersList && ordersList.orders.sort((a: Order, b: Order) => a.orderId - b.orderId).map((order: Order) => (
                    <div onClick={() => handleOrderClick(order.orderId)} key={order.orderId} className="flex gap-4 odd:bg-malachite-1 p-4 rounded-2xl hover:cursor-pointer hover:bg-malachite-3 transition-all duration-500">
                        <span className="w-1/4 text-center">{order.orderId}</span>
                        <span className="w-1/4 text-center">{formatDate(order.updateDate)}</span>
                        <span className={`w-1/4 text-center ${order.status === 'rejected' ? "text-blood-4 font-bold" : ""}
                            ${order.status === 'delivered' ? "text-malachite-4 font-bold" : ""}
                            ${order.status === 'sent' ? "text-desertsand-4 font-bold" : ""}`}>{OrderStatus[order.status as keyof typeof OrderStatus]}</span>
                        <span className="w-1/4 text-center font-bold">{order.finalDiscountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}