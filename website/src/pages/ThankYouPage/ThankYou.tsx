import { useParams } from "react-router-dom"
import courier from "../../img/shop-courier.webp"
import { toast } from "react-toastify"
import { useEffect } from "react"

export const ThankYou = () => {
    const { id } = useParams<{ id: string }>()
    const orderID = parseInt(id || "", 10)
    const currYear = new Date().getFullYear()
    useEffect(() => {
        toast.success("🎉 Zamówienie złożone pomyślnie")
    }, [])

    return (
        <div className="max-w-128 w-full flex flex-col grow justify-center items-center gap-8 text-3xl bg-malachite-0 my-4 p-4 rounded-2xl">
            <img src={courier} alt="logo" width={512} height={512} />
            <span>Dziękujemy za złożenie zamówienia</span>
            <span>Numer twojego zamówienia to: <span className="font-bold">SH/{orderID}/{currYear}</span></span>
        </div>
    )
}