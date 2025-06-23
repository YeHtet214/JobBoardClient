// // src/components/ModeToggle.tsx
// import { Moon, Sun } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem
// } from "@/components/ui/dropdown-menu"
// import { useTheme } from "@/components/ThemeProvider"

// export function ModeToggle() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon" className="relative">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         align="end"
//       >
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


// ModeToggle.tsx
import { useTheme } from "@/components/ThemeProvider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Computer, Moon, Sun } from "lucide-react"
import { useState } from "react"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="relative">
      <Button variant="outline" size="icon" className="relative" onClick={handleToggle}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      { open && (
        <ul className="absolute bottom-0 right-0 translate-y-[100%] bg-jb-surface min-w-20 shadow-lg z-100 rounded">
          <li onClick={() => setTheme("light")} className="p-2 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary"><Sun className="h-4 w-4 mr-2" />Light</li><hr/>
          <li onClick={() => setTheme("dark")} className="p-2 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary"><Moon className="h-4 w-4 mr-2" />Dark</li><hr/>
          <li onClick={() => setTheme("system")} className="p-2 cursor-pointer flex items-center hover:opacity-80 hover:text-jb-primary"><Computer className="h-4 w-4 mr-2" />System</li>
        </ul>
      )}
    </div>
  )
}
