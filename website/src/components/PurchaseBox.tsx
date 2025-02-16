import { DICTIONARY } from "@/constants"
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { BasketQuantityChangeAction } from "@/types/Dictionaries";
import { toast } from "react-toastify"
import { BasketItem } from "@/types/Basket";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { putToBasket } from "@/api/utils/putToBasket";
import { useBasketStore } from "@/stores/BasketStore";
import { BasketData } from "@/types/API Responses";
import { delFromBasket } from "@/api/utils/delFromBasket";
import { useAppSelector } from "@/app/hooks";
import { selectIsLoggedIn } from "@/pages/User/userSlice";

type PurchaseBoxProps = {
  data: BasketItem
}

export const PurchaseBox = ({ data }: PurchaseBoxProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const inputQuantity = useRef<HTMLInputElement>(null)
  const isPromo = data.discountedPrice != null
  const { setBasketData } = useBasketStore()
  const [basketQuantity, setBasketQuantity] = useState(data.basketQuantity)
  console.log(data)


  const handleAddToBasket = async () => {
    try {

      const newData = await putToBasket(data.productId, inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1)
      if (newData) {
        setBasketData(newData)
        toast.success("🥳 Produkt dodany do koszyka!")
        setBasketQuantity(newData.products.find((product) => product.productId === data.productId)?.basketQuantity || 0)
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

  const handleRemoveAllFromBasket = async (listing?: boolean | undefined) => {
    let newData: BasketData | undefined
    try {
      if (listing === true) {
        newData = await delFromBasket(data.productId, Number.MAX_SAFE_INTEGER)
      } else {

        newData = await delFromBasket(data.productId, inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1)
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

  return (
    <div className={"flex flex-col justify-between items-center w-full"}>
      <div className={"w-full flex flex-col gap-4"}>
        {isPromo && <>
          <div className={"flex justify-between text-4xl"}>
            <span>{DICTIONARY.REGULAR_PRICE}:</span>
            <span>{data.basePrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE} / {data.unit}</span>
          </div>
          <div className={"flex justify-between text-4xl text-blood-4"}>
            <span>{DICTIONARY.PROMO_PRICE}:</span>
            <span>{data.discountedPrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE} / {data.unit}</span>
          </div>
          <span className={"text-4xl font-bold text-blood-4"}>{DICTIONARY.PROMOTION}: {data.discount * 100}%</span>
        </>
        }
        {!isPromo && <>
          <div className={"flex justify-between text-4xl"}>
            <span>{DICTIONARY.YOUR_PRICE}:</span>
            <span>{data.basePrice.toFixed(2)} {DICTIONARY.CURRENCY_CODE} / {data.unit}</span>
          </div>
        </>}
      </div>
      {isLoggedIn && (
        <div className={"w-full flex items-center justify-center gap-4"}>
          <div className={"flex gap-4"}>
            <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.REMOVE)}><Minus className="hover:cursor-pointer" /></button>
            <Input ref={inputQuantity} type="number" min={1} max={data.availableUnits} defaultValue={1} className="text-center" />
            <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.ADD)}><Plus className="hover:cursor-pointer" /></button>
          </div>
          <div className="flex flex-col gap-4">
            {basketQuantity > 0 && <span className="text-lg flex justify-center">W koszyku: {basketQuantity} {data.unit}</span>}
            <button className="text-2xl max-lg:text-lg max-lg:flex-col max-lg:gap-2 rounded-2xl font-bold flex items-center gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all" onClick={handleAddToBasket}>
              <ShoppingCart /> {DICTIONARY.ADD_TO_BASKET}
            </button>
            {basketQuantity > 0 && <button className="text-lg flex justify-center bg-blood-3 w-20 self-center py-2 px-4 rounded-2xl" onClick={() => handleRemoveAllFromBasket(true)}>Usuń</button>}
          </div>

        </div>
      )}
    </div>
  )
}