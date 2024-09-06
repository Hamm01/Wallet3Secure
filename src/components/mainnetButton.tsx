import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
export let SolAlchemyUrl = import.meta.env.VITE_SOL_MAIN_ALCHEMY_URL// This variable is saved in .env file
export let EthAlchemyUrl = import.meta.env.VITE_ETH_MAIN_ALCHEMY_URL // This variable is saved in .env file
import { CircleCheckBig } from 'lucide-react';

export const MainnetButton: React.FC = () => {
    const [network, setNetwork] = useState<string>("mainnet")

    const { theme } = useTheme()
    const isDarkMode =
        theme === "dark" ||
        (theme === "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    function handlenetwork(value: string) {
        setNetwork(value)

    }
    useEffect(() => {
        if (network === "mainnet") {
            SolAlchemyUrl = import.meta.env.VITE_SOL_MAIN_ALCHEMY_URL
            EthAlchemyUrl = import.meta.env.VITE_ETH_MAIN_ALCHEMY_URL
        } else {
            SolAlchemyUrl = import.meta.env.VITE_SOL_DEV_ALCHEMY_URL
            EthAlchemyUrl = import.meta.env.VITE_ETH_DEV_ALCHEMY_URL

        }
        toast.success(`Network succesfully changed to ${network}`)


    }, [network, isDarkMode])

    return (
        <div>
            <Select onValueChange={handlenetwork}>
                <SelectTrigger className={`w-[120px] font-semibold ${network === "mainnet" ? 'bg-green-600 border-green-600 ' : 'bg-destructive border-destructive'} ${isDarkMode ? 'text-primary' : 'text-white'}`}>

                    <CircleCheckBig className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all  mr-1 `} />
                    <SelectValue placeholder="Network" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem defaultValue={network} value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="devnet">Devnet</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select></div>
    )
}
