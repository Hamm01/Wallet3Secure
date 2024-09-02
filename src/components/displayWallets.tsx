import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { copyToClipboard } from '../lib/utils'
import { EyeOff, Eye, Trash, List, LayoutGrid, CircleArrowUp, CircleArrowDown, RefreshCcw, CopyIcon } from 'lucide-react'
import { WalletType } from '../lib/types'
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useTheme } from "@/components/theme-provider"
import { fetchBalance } from "../lib/walletFunctions"
import { Label } from '@/components/ui/label'
import { AddressGenerator } from './addressGenerator'
import { SendComponent } from './sendComponent'

interface DisplayWalletsProps {
    wallets: WalletType[];
    pathTypes: string[]
    visiblePrivateKeys: boolean[]
    addNewWallet: () => void;
    clearWallets: () => void;
    deleteWallets: (index: number) => void;
    toggleVisibility: (index: number) => void;
}
interface walletBalance {
    pubkey: string,
    balance: number
}



export const DisplayWallets: React.FC<{ props: DisplayWalletsProps }> = ({ props }) => {
    const { wallets, pathTypes, visiblePrivateKeys, addNewWallet, clearWallets, deleteWallets, toggleVisibility } = props
    const [gridView, setGridView] = useState<boolean>(false)
    const [walletBalance, setWalletBalance] = useState<walletBalance[]>([])
    const WalletType = pathTypes[0] === "501" ? "Solana" : "Ethereum"

    useEffect(() => {

        // Doing every address a zero balance every time a new address genrated or new wallet created
        const addressWithZeroBalance = wallets.map(wallet => { return { pubkey: wallet.publicKey, balance: 0 } })
        // Now we are filtering the data with addressWithZeroBalance with the addresses we already have in walletBalance
        // we will take that balance for address from walletBalance , so that we dont thave to do everytime network request
        // for our existing fetched address balances
        const filteringAddressWithBalance = addressWithZeroBalance.map(wallet => {
            if (walletBalance.find(key => wallet.pubkey === key.pubkey)) {
                const foundaddress = walletBalance.filter(key => wallet.pubkey === key.pubkey)
                return { pubkey: wallet.pubkey, balance: foundaddress[0].balance }
            } else {
                return wallet
            }

        })
        setWalletBalance(filteringAddressWithBalance)

    }, [wallets])

    const { theme } = useTheme()
    const isDarkMode =
        theme === "dark" ||
        (theme === "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    const fetchWalletBalance = async (pubkey: string) => {
        if (!WalletType) {
            console.error("Failed in getting the Wallet type")
        }
        const balance = await fetchBalance(pubkey, WalletType)
        if (balance) {
            const updatedWalletBalance = walletBalance.map(wallet => {
                if (wallet.pubkey === pubkey) {
                    wallet.balance = balance
                }
                return wallet

            })
            setWalletBalance(updatedWalletBalance)
        }
    }
    function balanceOnScreen(address: string) {
        const account = walletBalance.find(key => key.pubkey === address)
        const amount = account ? Math.floor(account.balance * 1e6) / 1e6 : "0.00"
        return amount
    }
    return <div className='flex flex-col gap-8 '>
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
            <h1 className=' righteous-regular scroll-m-20 md:text-3xl lg:text-4xl font-semibold'>{WalletType} Wallet</h1>
            <div className="flex gap-2">
                {wallets.length > 1 && (<Button size="sm" variant="ghost" onClick={() => setGridView(!gridView)}>{gridView ? <LayoutGrid size={20} /> : <List size={20} />}</Button>)}

                <Button size="sm" onClick={addNewWallet} >Add Wallet</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Clear Wallets</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you want to clear all wallets</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                secret key and all the wallets listed on screen
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={clearWallets}>Delete Wallets</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
        <div className={`grid grid-col-1 col-span-1 gap-4 ${gridView ? "md:grid-cols-2 lg:grid-cols-3" : ""}  `}>
            {wallets.map((wallet: WalletType, index: number) => (
                <div className="flex flex-col border border-primary/50 rounded-md" key={index}>
                    <div className="flex justify-between px-8 py-6">
                        <h2 className='righteous-regular scroll-m-20 lg:text-3xl font-semibold'>Wallet {index + 1}</h2>
                        <div className='flex'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={() => fetchWalletBalance(wallet.publicKey)}><RefreshCcw size={18} /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Refresh Balance</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm"><Trash size={18} className='text-destructive' /> </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you want to delete this wallet</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will delete the wallet from the screen
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteWallets(index)}>Delete Wallet</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                    </div>
                    <div className='flex px-4 py-4 bg-accent justify-center rounded-t-3xl'>
                        <div className='flex flex-col relative my-4'>
                            <div className={`rounded-full px-10 py-10 ${!isDarkMode ? 'bg-gradient-to-r from-slate-900 to-slate-700' : 'bg-gradient-to-b from-slate-50 to-slate-400'}  cursor-pointer`}>
                                <div className="flex px-10 py-10 justify-center items-center">
                                    <p className='iceland text-3xl text-secondary tracking-tighter absolute'> {balanceOnScreen(wallet.publicKey)} <span className='text-2xl font-semibold tracking-normal'>{pathTypes[0] === "501" ? "SOL" : "ETH"} </span> </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2 justify-center">
                                <div className="button-grp flex flex-col justify-center items-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost"  ><CircleArrowDown size={24} /></Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Share Public Address</DialogTitle>
                                                <DialogDescription>
                                                    Anyone who has this Public Address can send you {WalletType}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col items-center space-x-2 gap-4">
                                                <div className="flex items-center space-y-4">
                                                    <AddressGenerator address={wallet?.publicKey} size={200} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="grid flex-1 gap-2">
                                                        <Label htmlFor="link" className="sr-only">
                                                            Link
                                                        </Label>
                                                        <p className='text-primary/80 text-sm font-medium cursor-pointer hover:text-primary border p-2 rounded-md truncate ' onClick={() => copyToClipboard(wallet?.publicKey)}>
                                                            {wallet?.publicKey}
                                                        </p>
                                                        {/* <Input
                                                            id="link"
                                                            defaultValue={wallet?.publicKey}
                                                            readOnly
                                                        /> */}
                                                    </div>
                                                    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(wallet?.publicKey)}>
                                                        <span className="sr-only">Copy</span>
                                                        <CopyIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                            </div>
                                            <DialogFooter className="sm:justify-start lg:justify-end">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary">
                                                        Close
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <p className='text-md font-semibold'>Recieve</p>
                                </div>
                                <div className="button-grp flex flex-col justify-center items-center">
                                    <SendComponent />
                                    <p className='text-md font-semibold'>Send</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col bg-secondary/50 px-8 py-6  cursor-pointer rounded'>
                        <div className="publickey flex flex-col w-full gap-2" onClick={() => copyToClipboard(wallet?.publicKey)}>
                            <span className="text-xl font-bold tracking-tighter">Public Key</span>
                            <p className="text-primary/80 font-medium cursor-pointer hover:text-primary truncate">
                                {wallet.publicKey}</p>
                        </div>
                        <div className="publickey flex flex-col w-full gap-2" >
                            <span className="text-xl font-bold tracking-tighter">Private Key</span>
                            <div className="flex justify-between w-full items-center gap-2">
                                <p className="text-primary/80 font-medium cursor-pointer hover:text-primary truncate" onClick={() => copyToClipboard(wallet?.privateKey)}>
                                    {visiblePrivateKeys[index]
                                        ? wallet.privateKey
                                        : "*".repeat(wallet.privateKey.length)}</p>
                                <Button variant="ghost" onClick={() => toggleVisibility(index)}>
                                    {visiblePrivateKeys[index] ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div >

    </div >

}
