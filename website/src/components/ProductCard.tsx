import { DICTIONARY } from "@/constants"
import { Link } from "@/components/Link"
import { Minus, Plus, ShoppingCart, Trash2, Warehouse } from "lucide-react"
import { BasketQuantityChangeAction, ProductCategory } from "@/types/Dictionaries"
import { Input } from "./ui/input"
import { useAppSelector } from "@/app/hooks"
import { selectIsLoggedIn } from "@/pages/User/userSlice"
import { BasketItem } from "@/types/Basket"
import { toast } from "react-toastify"
import { putToBasket } from "@/api/utils/putToBasket"
import { useBasketStore } from "@/stores/BasketStore"
import { useEffect, useRef, useState } from "react"
import { delFromBasket } from "@/api/utils/delFromBasket"
import { BasketData } from "@/types/API Responses"

export type ProductCardProps = {
  data: BasketItem;
  isBasket: boolean;
}


export const ProductCard = ({ data, isBasket }: ProductCardProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const { setBasketData } = useBasketStore()
  const inputQuantity = useRef<HTMLInputElement>(null)
  const [basketQuantity, setBasketQuantity] = useState(data.basketQuantity)

  useEffect(() => {
    if (inputQuantity.current && isBasket) {
      inputQuantity.current.value = data.basketQuantity.toString();
    }
  }, [data]);


  const handleAddToBasket = async () => {
    if (inputQuantity.current) {
      if (parseInt(inputQuantity.current.value) > data.availableUnits) {
        toast.error(`😥 Nie mamy tyle towaru na magazynie! Max: ${data.availableUnits} ${data.unit}`)
        inputQuantity.current.value = data.availableUnits.toString()
        return
      }
      if (basketQuantity === data.availableUnits) {
        toast.error(`😥 Nie możesz dodać więcej towaru do koszyka! Max: ${data.availableUnits} ${data.unit}`)
        return
      }
      if(basketQuantity + parseInt(inputQuantity.current.value) > data.availableUnits) {
        toast.error(`😥 Nie możesz dodać więcej towaru do koszyka! Max: ${data.availableUnits} ${data.unit}`)
        inputQuantity.current.value = (data.availableUnits - basketQuantity).toString()
        return
      }
    }

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

  const basketMinus = async () => {
    // disable input
    if (inputQuantity.current) {
      inputQuantity.current.disabled = true;
    }
    const currentBasketQuantity = inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1
    if (currentBasketQuantity <= 1) {
      handleRemoveAllFromBasket()
      toast.warn("Produkt usunięty z koszyka.")
      if (inputQuantity.current) {
        inputQuantity.current.disabled = false;
      }
      return
    } else {
      const newData = await delFromBasket(data.productId, 1)
      if (newData) {
        setBasketData(newData)
        if (inputQuantity.current) {
          inputQuantity.current.disabled = false;
        }
        return
      }
      return
    }
  }

  const basketPlus = async () => {
    const currentBasketQuantity = inputQuantity.current?.value ? parseInt(inputQuantity.current.value) : 1
    if (currentBasketQuantity >= data.availableUnits) {
      toast.error("😥 Nie mamy tyle towaru na magazynie!")
      if (inputQuantity.current) {
        inputQuantity.current.value = data.availableUnits.toString()
      }
      return
    }
    if (currentBasketQuantity < data.availableUnits) {
      const newData = await putToBasket(data.productId, 1)
      if (newData) {
        setBasketData(newData)
        return
      }
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
    <div className={"w-full h-full bg-malachite-0 flex flex-col gap-4 text-3xl p-8 rounded-2xl max-lg:text-lg"}>
      <span className={"font-bold"}><Link address={`/product/${data.productId}`} name={data.name} /></span>
      <div className={"flex gap-4 max-md:flex-col max-md:items-center"}>
        <div className="max-w-[22rem] max-h-[22rem] flex justify-center">

          <img src={`src/img/vegetables/${data.productId}.webp`} className="object-scale-down" alt={data.name}/>
        </div>
        <div className="flex w-full justify-between ">
          <div className={"flex flex-col gap-4 max-md:gap-1 lg:min-w-72 max-md:w-full"}>
            <span><span>{DICTIONARY.PRODUCER}: </span>{data.producer}</span>
            <span><span>{DICTIONARY.CATEGORY}: </span>{ProductCategory[data.category as keyof typeof ProductCategory]}</span>
            <span><span>{DICTIONARY.UNIT}: </span>{data.unit}</span>
            <span><span>{DICTIONARY.AVG_UNIT_WEIGHT}: </span>{data.avgUnitWeightKg} kg</span>
            <span><span>{DICTIONARY.FRESH_SHOP_ID}: </span>{String(data.productId).padStart(5, '0')}</span>
          </div>
          <div className="flex flex-col justify-between gap-4 min-w-[24rem]">
            <div className={"flex flex-col gap-4 max-md:gap-1"}>
              <span
                className={"flex justify-between"}><span>{data.discount ? DICTIONARY.REGULAR_PRICE : DICTIONARY.YOUR_PRICE}:</span>{data.basePrice.toFixed(2)} zł</span>
              {data.discount &&
                <div className={"flex flex-col gap-4  max-md:gap-1"}>
                  <span
                    className={"flex justify-between text-4xl font-bold text-blood-4 max-lg:text-xl"}><span>{DICTIONARY.DISCOUNT}: </span>{data.discount * 100}%</span>
                  <span
                    className={"flex justify-between text-4xl font-bold text-blood-4 max-lg:text-xl"}><span>{DICTIONARY.PROMO_PRICE}: </span>{data.discountedPrice?.toFixed(2)} zł</span>
                </div>
              }
            </div>
            <div className={"flex justify-between items-center gap-4"}>
              <span className="flex gap-4 items-center">
                <Warehouse />
                {DICTIONARY.AVAILABLE_QUANTITY}: </span><span
                  className={"text-flame-4 font-bold"}>{data.availableUnits} {data.unit}.</span>
            </div>
            {isLoggedIn &&
              <div className="flex flex-col gap-8">
                <div className="flex gap-8">
                  <div className="flex gap-4 items-center">
                    {!isBasket && (
                      <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.REMOVE)}><Minus className="hover:cursor-pointer" /></button>
                    )}
                    {isBasket && (
                      <button className="flex justify-center" onClick={basketMinus}><Minus className="hover:cursor-pointer" /></button>
                    )}
                    <Input ref={inputQuantity} disabled={isBasket} type="number" min={1} max={data.availableUnits} defaultValue={isBasket ? data.basketQuantity : 1} className="text-center" />
                    {/* <input type="number" min={1} max={data.availableUnits} defaultValue={isBasket ? data.basketQuantity : 1} className="text-center flex justify-center items-center" /> */}
                    {!isBasket && (
                      <button className="flex justify-center" onClick={() => handleQuantityChange(BasketQuantityChangeAction.ADD)}><Plus className="hover:cursor-pointer" /></button>
                    )}
                    {isBasket && (
                      <button className="flex justify-center" onClick={basketPlus}><Plus className="hover:cursor-pointer" /></button>
                    )}
                  </div>
                  {!isBasket &&
                    <div className="flex flex-col gap-4">
                      {basketQuantity > 0 && <span className="text-lg flex justify-center">W koszyku: {basketQuantity} {data.unit}</span>}
                      <button className="text-2xl max-lg:text-lg max-lg:flex-col max-lg:gap-2 rounded-2xl font-bold flex items-center gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all" onClick={handleAddToBasket}>
                        <ShoppingCart /> {DICTIONARY.ADD_TO_BASKET}
                      </button>
                      {basketQuantity > 0 && <button className="text-lg flex justify-center bg-blood-3 w-20 self-center py-2 px-4 rounded-2xl hover:bg-blood-4" onClick={() => handleRemoveAllFromBasket(true)}>Usuń</button>}
                    </div>}
                  {isBasket &&
                    <button className="text-2xl roudned-2xl font-bold flex items-center gap-8 px-4 py-4 bg-blood-3 rounded-2xl hover:bg-blood-4 transition-all" onClick={() => handleRemoveAllFromBasket()}>
                      <Trash2 className="size-12 max-lg:size-8" color="#fff" />
                    </button>}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}