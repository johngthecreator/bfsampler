import { Menu} from "lucide-react"
import { SheetTrigger, SheetContent, Sheet } from "./ui/sheet"

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
            <div className="grid grid-cols-4 items-center gap-4">
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )

}