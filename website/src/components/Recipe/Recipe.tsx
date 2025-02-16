import { RecipeCategory } from '@/types/Dictionaries';
import { Recipe as RecipeType } from '../../types/API Responses';
import { Star, StarHalf } from "lucide-react";
export const Recipe = ({ recipe }: { recipe: RecipeType }) => {
    return (
        <div className="flex flex-col gap-4 w-80 bg-verdigris-2 p-8 rounded-2xl" key={recipe.recipeId} >
            <span className='text-lg'>{RecipeCategory[recipe.category as unknown as keyof typeof RecipeCategory]}</span>
            <span className="font-bold">{recipe.name}</span>
            <img src={`${recipe.img}`} alt={recipe.name} className='rounded-2xl' loading='lazy' width={160} height={160} />
            {/* <span>Stopień trudności: {recipe.difficulty}</span> */}
            <div className="relative">
                <div className="flex gap-4">
                    {Array.from({ length: 5 }, (_, index) => (<Star key={`empty-star-${index}`} fill="#111" strokeWidth={0} />))}
                </div>
                <div className="flex gap-4 absolute top-0">
                    {Array.from({ length: Math.floor(recipe.difficulty) }, (_, index) => (
                        <Star key={`star-${index}`} fill="yellow" strokeWidth={0} />
                    ))}
                </div>
            </div>
        </div>
    )
}