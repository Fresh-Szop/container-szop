import { useFetchAllAddresses } from "@/api/hooks/useFetchAllAddresses";
import { PlaceOrder } from "@/api/utils/placeOrder";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAddressModal } from "@/components/UserProfile/AddAddressModal";
import { DICTIONARY } from "@/constants";
import { useBasketStore } from "@/stores/BasketStore";
import { Address } from "@/types/API Responses";
import { useState } from "react";
import { DNA } from "react-loader-spinner";
import { toast } from "react-toastify";

export const OrderSummary = () => {
    const { basketSummary } = useBasketStore();
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
    const { data: addresses, isLoading, isError, refetch } = useFetchAllAddresses()
    console.log(addresses);

    const placeOrderHandler = async () => {
        if (!selectedAddress) {
            toast.error("Wybierz adres dostawy");
            return;
        }
        const res = await PlaceOrder(selectedAddress);
        console.log(res);
        window.location.assign(`/order-placed/${res.orderId}`)
    }

    return (
        <div className="max-w-128 w-full my-4 rounded-2xl p-4 grow bg-malachite-0 flex flex-col items-center text-3xl gap-16">
            <div className="font-bold">Podsumowanie koszyka:</div>
            {/* // final base
            // final discount */}
            <div className="flex flex-col max-w-[300px] w-full gap-8">
                <div className="flex justify-between w-full">
                    <span>Łączna&nbsp;wartość:</span>
                    <span>{basketSummary?.finalBasePrice.toFixed(2)}&nbsp;zł</span>
                </div>
                <div className="flex justify-between w-full text-blood-4 font-bold">
                    <span>Wartość&nbsp;z&nbsp;rabatem:</span>
                    <span>{basketSummary?.finalDiscountedPrice.toFixed(2)}&nbsp;zł</span>
                </div>
            </div>
            <div className="flex flex-col gap-8">
                {isLoading && <div className="flex justify-center w-full">
                    <DNA height="200" width="200" />
                </div>}
                {!isLoading && addresses && !(addresses instanceof Error) && addresses.length === 0 && <div className="font-bold flex flex-col gap-8">
                    <span>{DICTIONARY.NO_ADDRESSES_DEFINED}</span>
                    <div className="flex justify-center w-full"><AddAddressModal refetchAddresses={refetch} /></div>
                </div>}
                {!isLoading && addresses && !(addresses instanceof Error) && addresses.length > 0 && (
                    <div className="font-bold">Wybierz adres dostawy:</div>
                )}
                <div className="flex flex-col w-full gap-4 items-center">
                    <Select onValueChange={setSelectedAddress} >
                        <SelectTrigger className="w-96 py-8 px-4 text-2xl">
                            <SelectValue placeholder="Wybierz adres dostawy" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {addresses && addresses.map((address: Address) => (
                                    <SelectItem className="text-2xl" key={address.addressName} value={address.addressName}>{address.addressName}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={placeOrderHandler} variant={"outline"} className="text-3xl py-8 rounded-2xl bg-malachite-3 transition-all hover:bg-malachite-5 text-white hover:text-white">{DICTIONARY.PLACE_ORDER}</Button>
            </div>
        </div>
    )
}