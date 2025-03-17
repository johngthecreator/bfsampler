import { Home, Scissors} from "lucide-react"
import { Link } from "react-router"

export default function MenuBar(props:{id: number}){
    return(
        <nav className="w-full flex justify-between item-center mt-5 p-5 border-t-1 border-solid border-black">
            <Link to={`/?id=${props.id}`} className="text-black font-bold">
                <Home />
            </Link>
            <Link to={`/splitter?id=${props.id}`} className="text-black font-bold">
                <Scissors />
            </Link>
        </nav>
    )

}