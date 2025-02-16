import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { DICTIONARY } from "@/constants"
import { selectIsLoggedIn, selectUserData } from "@/pages/User/userSlice"
import { House, UserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { logOut } from "@/pages/User/userSlice"
import { LogOut } from "@/api/utils/logOut"

export const Menu = () => {
  const userData = useAppSelector(selectUserData)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const handleLogOut = async () => {
    const res = await LogOut();
    dispatch(logOut())
    
  }

  return (
    <div className="h-fit w-full bg-verdigris-2 flex justify-between rounded-br-2xl rounded-bl-2xl z-10">
      <div className="flex gap-4 items-center justify-center">
        <Link to="/" className="flex items-center p-4 h-full">
          <House className={"hover:scale-110 transition-all"} size={40} />
        </Link>
        {(isLoggedIn && userData) && (
          <li className="text-3xl flex items-center gap-4 p-4">
            Witaj <Link to="/user-profile"> <span title="Ustawienia konta" className="font-bold">{`${userData.firstName} ${userData.lastName}`}</span></Link>
          </li>
        )}
      </div>


      <ul className="flex justify-between ">
        <li>
          <Link to="/" className="menu-item">{DICTIONARY.START}</Link>
        </li>
        <li>
          <Link to="/products" className="menu-item">{DICTIONARY.PRODUCTS}</Link>
        </li>
        {(isLoggedIn && (
          <>
            <li>
              <Link to="/orders" className="menu-item">
                {DICTIONARY.ORDERS}
              </Link>
            </li>
            <li>
              <Link to="/subscriptions" className="menu-item">
                {DICTIONARY.SUBSCRIPTIONS}
              </Link>
            </li>
            <li>
              <Link to="/recipes" className="menu-item">
                {DICTIONARY.RECIPES}
              </Link>
            </li>
          </>
        ))}
        {(isLoggedIn && userData) && (
          <button className="menu-item" onClick={handleLogOut}>
            <span > {DICTIONARY.LOGOUT}</span>
          </button>
        )}

        {!isLoggedIn && (
          <li>
            <Link to="/login" className="menu-item font-bold">
              <UserRound size={40} /> {DICTIONARY.LOGIN_REGISTER}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
