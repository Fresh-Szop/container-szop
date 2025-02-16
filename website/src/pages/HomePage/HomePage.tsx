import logo from "../../img/fresh-shop-logo.png"
import { useAppSelector } from "@/app/hooks"
import { selectIsLoggedIn } from "@/pages/User/userSlice"
import subscription from "../../img/szop-subscription.png"
import recipe from "../../img/szop-recipe.png"
import fresh from "../../img/szop-fresz.png"
import bannerFruits from "../../img/banner-fruits.jpg"
import { Link } from "react-router-dom"

export const HomePage = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    return (
        <div className="w-full font-sans h-full flex flex-col grow my-4">
            <div className={"w-full bg-[url(../src/img/banner2.jpg)] bg-cover mb-4"}>
                {!isLoggedIn && (
                    <div className="h-80 w40 ">
                        <img src={logo} className=" h-full w-auto" alt="logo" />
                    </div>
                )}
            </div>
            <div className="w-full flex gap-4">
                <span className="bg-verdigris-3 w-1/3 flex flex-col items-center justify-center grow gap-8 p-8 text-2xl rounded-2xl">
                    <div className="max-w-96 max-h-96 flex"><img src={subscription} alt="subscription" className="w-96 object-cover" /></div>
                    <div className="flex flex-col gap-4">
                        <div className="text-3xl font-bold text-center">Subskrypcje na czas</div>
                        <span>Nie martw się o zakupy! Dzięki naszej subskrypcji, wybrane produkty dostarczamy automatycznie co określony czas. Ciesz się wygodą i pewnością, że zawsze masz to, czego potrzebujesz.</span>
                    </div>

                </span>
                <span className="bg-malachite-3 w-1/3 flex flex-col items-center justify-center grow gap-8 p-8 text-2xl rounded-2xl">
                    <div className="max-w-96 max-h-96 flex"><img src={recipe} alt="recipe" className="w-96 object-cover" /></div>
                    <div className="flex flex-col gap-4">
                        <div className="text-3xl font-bold text-center">Koszyk prosto z przepisu</div>
                        <span>Przygotuj swoje ulubione dania jeszcze szybciej! Dodaj wszystkie składniki z przepisu do koszyka i ciesz się gotowaniem bez zbędnych zakupów.</span>
                    </div>
                </span>
                <span className="bg-desertsand-3 w-1/3 flex flex-col items-center justify-center grow gap-8 p-8 text-2xl rounded-2xl">
                    <div className="max-w-96 max-h-96 flex"><img src={fresh} alt="fresh" className="w-96 object-cover" /></div>
                    <div className="flex flex-col gap-4">
                        <div className="text-3xl font-bold text-center">Produkty zawsze świeże</div>
                        <span>Zawsze świeże produkty na wyciągnięcie ręki! Gwarantujemy najwyższą jakość i świeżość, aby Twoje dania były smaczne i zdrowe. Zakupy u nas to pewność, że zawsze dostaniesz to, co najlepsze.</span>
                    </div>
                </span>
            </div>
            <div className="w-full flex justify-center bg-desertsand-1 mt-4 grow max-h-[46rem] relative">
                <img src={bannerFruits} alt="fruits" className=" object-fill" />
                <span className="absolute top-1/4 left-[20%] transform -translate-y-1/2 text-4xl font-bold text-desertsand-9">Promocja na sezonowe owoce !</span>
                <Link to={'/products?category=fruit&isSeason=true&discount=true&banner=true'}><button className="btn absolute left-[20%] top-1/2 transform -translate-y-1/2">Zobacz Promocje</button></Link>
            </div>
        </div>
    )
}
