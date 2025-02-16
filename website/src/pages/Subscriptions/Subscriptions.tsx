import { useFetchAllSubscriptions } from "@/api/hooks/useFetchAllSubscriptions";
import { DICTIONARY } from "@/constants"
import { SubscriptionStatus } from "@/types/Dictionaries";
import { DNA } from "react-loader-spinner"
import { formatDate } from '../../api/utils/dateFormatter';
import { Subscription } from "@/types/API Responses";

export const Subscriptions = () => {
    const { data, isLoading } = useFetchAllSubscriptions()

    const handleSubscriptionClick = (orderId: number) => {
        window.location.assign(`/subscription/${orderId}`)
    }
    return (
        <div className="max-w-128 w-full my-4 rounded-2xl p-4 bg-malachite-0 flex flex-col flex-grow text-2xl gap-8">
            <span className="flex w-full justify-center text-3xl font-bold">{DICTIONARY.YOUR_SUBSCRIPTIONS}</span>
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            <div className="flex flex-col gap-4 border-2 border-malachite-5 rounded-2xl p-8">
                <div className="flex gap-4">
                    <span className="w-1/5 text-center">{DICTIONARY.SUBSCRIPTION_ID}</span>
                    <span className="w-1/5 text-center">{DICTIONARY.DATE}</span>
                    <span className="w-1/5 text-center">{DICTIONARY.STATUS}</span>
                    <span className="w-1/5 text-center">{DICTIONARY.FREQUENCY} (tyg)</span>
                    <span className="w-1/5 text-center">{DICTIONARY.PRICE}</span>
                </div>
                {!isLoading && data && (
                    data.subscriptions.sort((a: Subscription, b: Subscription) => a.subscriptionId - b.subscriptionId).map((subscription) => (
                        <div onClick={() => handleSubscriptionClick(subscription.subscriptionId)} key={subscription.subscriptionId} className="flex gap-4 odd:bg-malachite-1 py-4 rounded-2xl hover:cursor-pointer hover:bg-malachite-3 transition-all duration-500">
                            <span className="w-1/5 text-center">{subscription.subscriptionId}</span>
                            <span className="w-1/5 text-center">{formatDate(subscription.creationDate)}</span>
                            <span className={`w-1/5 text-center ${subscription.status === 'paused' ? "text-blood-4 font-bold" : subscription.status === 'active' ? "text-malachite-5 font-bold" : ""}`}>{SubscriptionStatus[subscription.status as keyof typeof SubscriptionStatus]}</span>
                            <span className="w-1/5 text-center">{subscription.frequency}</span>
                            <span className="w-1/5 text-center font-bold">{subscription.finalDiscountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}