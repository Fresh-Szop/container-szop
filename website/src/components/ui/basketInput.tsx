import { BasketQuantityChangeAction } from "@/types/Dictionaries"
import { Input } from "./input"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { delFromBasket } from "@/api/utils/delFromBasket"
import { BasketData } from "@/types/API Responses"
import { useBasketStore } from "@/stores/BasketStore"
import { putToBasket } from "@/api/utils/putToBasket"
import { BasketItem } from "@/types/Basket"

type BasketInputProps = {
    productId: number
    data: BasketItem
}

export const BasketInput = ({ productId, data }: BasketInputProps) => {
    const { setBasketData } = useBasketStore()
    const [basketQuantity, setBasketQuantity] = useState(0)
    const inputQuantity = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setBasketQuantity(data.basketQuantity)
    }, [data])


    const handleQuantityChange = (action: BasketQuantityChangeAction) => {
        if (action === BasketQuantityChangeAction.ADD) {
            if (inputQuantity.current && parseInt(inputQuantity.current.value) >= data.availableUnits) {
                toast.error("😥 Nie mamy tyle towaru na magazynie!")
                inputQuantity.current.value = data.availableUnits.toString()
                return
            }
            if (inputQuantity.current) {
                inputQuantity.current.value = (parseInt(inputQuantity.current.value) + 1).toString()
                return
            }
        }
        if (action === BasketQuantityChangeAction.REMOVE) {
            if (inputQuantity.current && parseInt(inputQuantity.current.value) <= 1) {
                toast.error("😥 Nie możesz mieć mniej niż jedną sztukę produktu w koszyku!")
                return
            } else if (inputQuantity.current && parseInt(inputQuantity.current.value) > data.availableUnits) {
                inputQuantity.current.value = data.availableUnits.toString()
                return
            }
            if (inputQuantity.current) {
                inputQuantity.current.value = (parseInt(inputQuantity.current.value) - 1).toString()
            }
        }
    }

    const handleRemoveAllFromBasket = async (listing?: boolean | undefined) => {
        let newData: BasketData | undefined
        try {
            if (listing === true) {
                newData = await delFromBasket(productId, Number.MAX_SAFE_INTEGER)
            } else {

                newData = await delFromBasket(productId, inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1)
            }
            if (newData) {
                setBasketData(newData)
            }
            toast.success("🥳 Produkt usunięty z koszyka!")
            setBasketQuantity(0)
            return
        } catch (e) {
            toast.error(`😥 ${e} 😱`)
            return
        }
    }

    const handleAddToBasket = async () => {
        if (inputQuantity.current) {
            if (parseInt(inputQuantity.current.value) > data.availableUnits) {
                toast.error(`😥 Nie mamy tyle towaru na magazynie! Max: ${data.availableUnits} ${unit}`)
                inputQuantity.current.value = data.availableUnits.toString()
                return
            }
            if (basketQuantity === data.availableUnits) {
                toast.error(`😥 Nie możesz dodać więcej towaru do koszyka! Max: ${data.availableUnits} ${unit}`)
                return
            }
            if (basketQuantity + parseInt(inputQuantity.current.value) > data.availableUnits) {
                toast.error(`😥 Nie możesz dodać więcej towaru do koszyka! Max: ${data.availableUnits} ${data.unit}`)
                inputQuantity.current.value = (data.availableUnits - basketQuantity).toString()
                return
            }
        }

        try {
            const newData = await putToBasket(productId, inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1)
            if (newData) {
                setBasketData(newData)
                toast.success("🥳 Produkt dodany do koszyka!")
                setBasketQuantity(newData.products.find((product) => product.productId === productId)?.basketQuantity || 0)
                if (inputQuantity.current) {
                    inputQuantity.current.value = "1";
                }
                return
            }
        } catch (e) {
            toast.error(`😥 ${e} 😱`)
            return
        }
    }

    const unit = 'placeholder'
    return (
        <div className="flex gap-8">
            <div className="flex gap-4 items-center w-80">
                <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.REMOVE)}><Minus className="hover:cursor-pointer" /></button>
                {/* <Input ref={inputQuantity} type="number" min={1} max={data.availableUnits} defaultValue={data.basketQuantity} className="text-center" /> */}
                <Input ref={inputQuantity} type="number" min={1} defaultValue={1} className="text-center" />
                <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.ADD)}><Plus className="hover:cursor-pointer" /></button>
            </div>
            <div className="flex gap-4 relative">
                {basketQuantity > 0 && <span className="text-lg absolute top-0 left-0 rounded-full flex justify-center items-center bg-blood-4 w-8 h-8 ml-[30px] mt-[-5px]">{basketQuantity}</span>}
                <button title={`W koszyku: ${basketQuantity} ${data.unit}`} className="text-2xl max-lg:text-lg max-lg:flex-col max-lg:gap-2 rounded-2xl font-bold flex justify-center items-center gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all" onClick={handleAddToBasket}>
                    <ShoppingCart />
                </button>
                {basketQuantity > 0 && <button className=" absolute bottom-0 left-0 mb-[-35px] text-lg flex justify-center bg-blood-3 w-20 self-center py-2 px-4 rounded-2xl hover:bg-blood-4" onClick={() => handleRemoveAllFromBasket(true)}>Usuń</button>}
            </div>
        </div>
    )
}