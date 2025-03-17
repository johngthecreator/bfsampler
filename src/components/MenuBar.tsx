import { Menu} from "lucide-react"
import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet"
import { Link } from "react-router"

export default function MenuBar(){
    return(
        <Sheet>
        <nav className="w-full flex justify-between item-center pb-5">
            <SheetTrigger asChild>
                <button>
                    <Menu />
                </button>
            </SheetTrigger>
            <p className="font-black text-2xl">dpplr.</p>
            <SheetTrigger asChild>
                <button>
                    <Menu />
                </button>
            </SheetTrigger>
        </nav>
        <SheetContent className="p-2" side="left" >
          <div className="grid gap-4 py-4">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/splitter" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Splitter
            </Link>
            <Link to="/sessions" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Sessions
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    )

}