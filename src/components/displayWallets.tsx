import { useState } from 'react'
import { Button } from './ui/button'
import { copyToClipboard } from '../lib/utils'
import { EyeOff, Eye, Trash, List, LayoutGrid, ArrowUp, ArrowDown } from 'lucide-react'
import { WalletType } from '../lib/types'
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

import { useTheme } from "@/components/theme-provider"

interface DisplayWalletsProps {
    wallets: WalletType[];
    pathTypes: string[]
    visiblePrivateKeys: boolean[]
    addNewWallet: () => void;
    clearWallets: () => void;
    deleteWallets: (index: number) => void;
    toggleVisibility: (index: number) => void;
}



export const DisplayWallets: React.FC<{ props: DisplayWalletsProps }> = ({ props }) => {
    const { wallets, pathTypes, visiblePrivateKeys, addNewWallet, clearWallets, deleteWallets, toggleVisibility } = props
    const [gridView, setGridView] = useState<boolean>(false)
    const { theme, setTheme } = useTheme()
    const isDarkMode =
        theme === "dark" ||
        (theme === "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    return <div className='flex flex-col gap-8 '>
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
            <h1 className=' righteous-regular scroll-m-20 md:text-3xl lg:text-4xl font-semibold'>{pathTypes[0] === "501" ? "Solana" : "Ethereum"} Wallet</h1>
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm"><Trash size={18} className='text-destructive' />  </Button>
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
                    <div className='flex px-4 py-4 bg-accent justify-center rounded-t-3xl'>
                        <div className='flex flex-col relative my-4'>
                            <div className={`rounded-full px-10 py-10 ${!isDarkMode ? 'bg-gradient-to-r from-slate-900 to-slate-700' : 'bg-gradient-to-b from-slate-50 to-slate-400'}  cursor-pointer`}>
                                <div className="flex px-10 py-10 justify-center items-center">
                                    <p className='text-4xl text-secondary tracking-tighter absolute'> 0.00 <span className='text-lg'>ETH</span> </p>
                                </div>
                            </div>

                            <div className="flex gap-4 my-2 justify-center">
                                <div className="button-grp flex flex-col justify-center items-center">
                                    <Button variant="outline" className='' ><ArrowUp size={18} /></Button>
                                    <p>Send</p>
                                </div>
                                <div className="button-grp flex flex-col justify-center items-center">
                                    <Button variant="outline"><ArrowDown size={18} /></Button>
                                    <p>Receive</p>

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
        </div>

    </div>

}
