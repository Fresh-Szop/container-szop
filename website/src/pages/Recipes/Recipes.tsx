import { useFetchRecipesList } from "@/api/hooks/useFetchRecipesList"
import { Recipe } from "@/components/Recipe/Recipe"
import { Recipe as SingleRecipe } from "@/types/API Responses"
import { DNA } from "react-loader-spinner"
import { Link } from "react-router-dom"

export const Recipes = () => {
    const { data, isLoading } = useFetchRecipesList()

    return (
        <div className="bg-malachite-0 max-w-128 w-full grow my-4 rounded-2xl p-4 text-2xl flex flex-col gap-8">
            <h1 className="text-4xl font-bold flex justify-center">Lista przepisów</h1>
            {isLoading && <div className="flex justify-center w-full">
                <DNA height="200" width="200" />
            </div>}
            <div className="flex flex-wrap gap-16">
                {data && data.recipes.map((recipe: SingleRecipe) => (
                    <Link to={'/recipe/' + recipe.recipeId} className="flex items-center p-4 h-full" key={recipe.recipeId}>
                        <Recipe recipe={recipe}  />
                    </Link>
                ))}
            </div>
        </div>
    )
}