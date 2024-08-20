import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const isDarkMode =
        theme === "dark" ||
        (theme === "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);


    return (<div className="flex">
        <Sun
            className={`h-5 w-5 ${isDarkMode ? "text-primary/50" : "text-primary"} mr-1`}
        />
        <Switch checked={isDarkMode} onCheckedChange={(e) => setTheme(e ? "dark" : 'light')} />
        <Moon
            className={`h-5 w-5 ${isDarkMode ? "text-primary/50" : "text-primary"} ml-1`}
        />
    </div>
    )
}
