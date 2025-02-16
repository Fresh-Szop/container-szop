import { useFetchSpecificRecipe } from "@/api/hooks/useFetchSpecificRecipe"
import { useParams } from "react-router-dom"
import { DNA } from 'react-loader-spinner'
import { ShoppingCart, Star } from "lucide-react"
import { useFetchRecipeBasketState } from "@/api/hooks/useFetchRecipeBasketState"
import { Input } from "@/components/ui/input"
import { DICTIONARY } from "@/constants"
import { BasketInput } from "@/components/ui/basketInput"

export const RecipeDetails = () => {
    const { recipeID: id } = useParams<{ recipeID: string }>()
    const recipeID = parseInt(id || "", 10)

    const { data, isLoading, isError } = useFetchSpecificRecipe(recipeID)
    // endpoint is not implemented yet
    const { data: recipeData, isLoading: isLoadingRecipe } = useFetchRecipeBasketState(recipeID)
    // console.log(recipeID, data)

    return (
        <div className="bg-malachite-0 max-w-128 w-full grow my-4 rounded-2xl p-8 text-2xl flex flex-col gap-8">
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            {!isLoading && !isLoadingRecipe && data && (
                <>
                    <span className="text-3xl font-bold text-malachite-6">{data.name}</span>
                    <div className="flex justify-between">
                        {/* img and difficulty */}
                        <div className="flex flex-col gap-4 w-fit items-center">
                            <div className="max-w-96">
                                <img src={data.img} alt={data.name}
                                    className="w-full rounded-2xl drop-shadow-xl" />
                            </div>
                            <div className="w-fit p-4 bg-verdigris-5 rounded-2xl">
                                <div className="relative">
                                    <div className="flex gap-4">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <Star key={`empty-star-${index}`} fill="#111" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <div className="flex gap-4 absolute top-0">
                                        {Array.from({ length: Math.floor(data.difficulty) }, (_, index) => (
                                            <Star key={`star-${index}`} fill="yellow" strokeWidth={0} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ingredients */}
                        <div className="flex flex-col gap-16 text-xl">
                            <span className="text-2xl font-bold">Składniki</span>
                            {data.ingredients.length > 0 && (
                                data.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex justify-between items-center gap-8">
                                        <div className="flex gap-4">
                                            <span className="text-xl font-bold">{ingredient.name}</span>
                                            <span className="text-xl">{ingredient.quantity}</span>
                                        </div>
                                        {ingredient.productId && recipeData?.products.find((product) => product.productId === ingredient.productId)
                                            && (<BasketInput productId={ingredient.productId} data={recipeData.products.find((product) => product.productId === ingredient.productId)!} />
                                            )}
                                    </div>
                                )
                                ))}
                        </div>
                        {/* steps */}
                        <div className="flex flex-col gap-8 text-2xl">
                            <span className="text-2xl font-bold">Sposób przygotowania</span>
                            {data.steps.length > 0 && (
                                data.steps.map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <span className="text-xl">{index + 1}.</span>
                                        <span className="text-xl">{step}</span>
                                    </div>
                                )
                                ))}
                        </div>

                    </div>



                </>
            )}

        </div>
    )
}