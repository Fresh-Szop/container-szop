import { useFetchAllAddresses } from "@/api/hooks/useFetchAllAddresses"
import { useAppSelector } from "@/app/hooks"
import { selectIsLoggedIn, selectUserData } from "../User/userSlice"
import { useEffect } from "react"
import { Address } from "@/types/API Responses"
import { EditAddressModal } from "@/components/UserProfile/EditAddressModal"
import { AddAddressModal } from "@/components/UserProfile/AddAddressModal"
import { DeleteAddressModal } from "@/components/UserProfile/DeleteAddressModal"
import { DNA } from "react-loader-spinner"

export const UserProfile = () => {
    const userData = useAppSelector(selectUserData)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.assign('/')
        }
    }, [isLoggedIn])

    const { data: addresses, isLoading, refetch } = useFetchAllAddresses()
    console.log(addresses)
    return (
        <div className="flex grow bg-malachite-0 max-w-128 w-full my-4 rounded-2xl p-4">
            <div className="w-full flex flex-col items-center text-2xl gap-8">
                <div className="flex flex-col items-center gap-4">
                    <span className="font-bold text-3xl">Dane użytkownika</span>
                    <div className="flex bg-malachite-3 gap-8 border-2 border-malachite-5 rounded-2xl p-8">
                        <div className="flex items-center justify-center">
                            <img src={userData.picture} alt="user" className="w-32 h-32 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="flex gap-4">Imię: <span className="font-bold">{userData.firstName}</span></span>
                            <span className="flex gap-4">Nazwisko: <span className="font-bold">{userData.lastName}</span></span>
                            <span className="flex gap-4">Email: <span className="font-bold">{userData.email}</span></span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 max-w-[500px] w-full">
                    <div className="font-bold text-3xl">Adresy dostaw</div>
                    {isLoading && <div className="flex justify-center w-full">
                        <DNA height="200" width="200" />
                    </div>}
                    <div className="flex flex-col w-full gap-4 items-center">
                        {Array.isArray(addresses) && addresses.length === 0 && <div>Brak zdefiniowanych adresów dostawy</div>}
                        {Array.isArray(addresses) && addresses.length > 0 && addresses.map((el) => (
                            <div className="flex justify-between w-[350px]" key={el.addressName}>
                                {el.addressName}
                                <div className="flex gap-4 items-center"><EditAddressModal name={el.addressName} refetchAddresses={refetch}/>
                                    <DeleteAddressModal addressName={el.addressName} refetchAddresses={refetch}/>
                                </div>
                            </div>
                        ))}</div>
                </div>
                <div className="flex justify-center w-full"><AddAddressModal refetchAddresses={refetch} /></div>
            </div>
        </div>
    )
}