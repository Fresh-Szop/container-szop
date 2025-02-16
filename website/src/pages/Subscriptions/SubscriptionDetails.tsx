import { useFetchSubscription } from "@/api/hooks/useFetchSubscription"
import { DICTIONARY } from "@/constants"
import { SubscriptionStatus } from "@/types/Dictionaries"
import { DNA } from "react-loader-spinner"
import { useParams } from "react-router-dom"
import { OrderDetailProduct } from "../Orders/OrderDetailProduct"
import { EditSubscriptionModal } from "./EditSubscriptionModal"
import { DeleteSubscriptionModal } from "./DeleteSubscriptionModal"
import { formatDate } from '../../api/utils/dateFormatter';
import { OrderItem } from "@/types/Basket"

export const SubscriptionDetails = () => {
    const { id } = useParams<{ id: string }>()
    const subscriptionID = parseInt(id || "", 10)
    const { data, isLoading, refetch } = useFetchSubscription(subscriptionID)

    return (
        <div className="max-w-128 w-full bg-malachite-0 p-4 rounded-2xl text-2xl flex flex-col flex-grow gap-8 my-4">
            <span className="font-bold text-3xl flex justify-center">Szczegóły subskrypcji</span>
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            {data && (
                <>
                    <div className="flex justify-between border-2 border-malachite-5 rounded-2xl p-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <span>{DICTIONARY.SUBSCRIPTION_ID}:</span>
                                <span className="font-bold">{subscriptionID}</span>
                            </div>
                            <div className="flex gap-4">
                                <span>{DICTIONARY.CREATION_DATE}:</span>
                                <span className="font-bold">{formatDate(data.creationDate)}</span>
                            </div>
                            <div className="flex gap-4">
                                <span>{DICTIONARY.STATUS}:</span>
                                <span className={`font-bold ${data.status === 'paused' ? "text-blood-4" : data.status === 'active' ? "text-malachite-5" : ""}`}>{SubscriptionStatus[data.status as keyof typeof SubscriptionStatus]}</span>
                            </div>
                            <div className="flex gap-4">
                                <span>Nazwa adresu:</span>
                                <span className="font-bold">{data.addressName}</span>
                            </div>
                            <div className="flex gap-4">
                                <span>{DICTIONARY.ORDER_VALUE}:</span>
                                <span className="font-bold">{data.finalDiscountedPrice.toFixed(2)} zł</span>
                            </div>
                            <div className="flex gap-4">
                                <span>{DICTIONARY.FREQUENCY}:</span>
                                <span className="font-bold">Co {data.frequency} tyg.</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-8 items-center">
                            <EditSubscriptionModal data={{ status: data.status, addressName: data.addressName, frequency: data.frequency, id: data.subscriptionId }} refetchData={refetch} />
                            <DeleteSubscriptionModal id={data.subscriptionId} />
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
            )}

        </div>
    )
}