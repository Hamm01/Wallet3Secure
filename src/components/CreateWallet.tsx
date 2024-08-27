import { WalletType } from '../lib/types'
import { useState, useEffect } from "react"
import WalletHome from "./WalletHome"
import InputRecoveryPhrase from './InputRecoveryPhrase'
import { clearWalletsKeys, createMemonicWallet, fetchWallet, generateMnemonicWords, saveWalletKeys } from '../lib/walletFunctions'
import { DisplayRecoveryPhrase } from './displayRecoveryPhrase'
import { Button } from './ui/button'
import { copyToClipboard } from '../lib/utils'
import { EyeOff, Eye, Trash, List, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'
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

export default function CreateWallet() {
    const [wallets, setWallets] = useState<WalletType[]>([])
    const [pathTypes, setPathtypes] = useState<string[]>([])
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(
        Array(12).fill(" ")
    );
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
    const [mnemonicInput, setMnemonicInput] = useState<string>("")
    const [gridView, setGridView] = useState<boolean>(false)


    useEffect(() => {
        const storedkeys = fetchWallet()
        if (storedkeys) {
            const { wallets, mnemonics, pathTypes } = storedkeys
            setPathtypes(pathTypes)
            setMnemonicWords(mnemonics)
            setWallets(wallets)
            setVisiblePrivateKeys(wallets.map(() => false))
            toast.success("Wallet Fetched properly")
        }

    }, [])


    const toggleVisibility = (index: number) => {
        return setVisiblePrivateKeys(visiblePrivateKeys.map((value, i) => i === index ? !value : value))
    }
    // Wallet Genearator using mnemonic
    const walletGenerate = async () => {
        // Generating or validating the 12 key phrase
        const mnemonicArray = await generateMnemonicWords(mnemonicInput)

        if (!mnemonicArray) {
            console.error('Memonics Error during validation or generating')
            return;
        } else {
            setMnemonicWords(mnemonicArray)
            const mnemonic = mnemonicArray.join(" ")
            const stringCase = pathTypes?.[0] || " "
            const AccountIndex = wallets.length
            const Wallet = createMemonicWallet({
                mnemonic, pathTypes: stringCase, index: AccountIndex
            })
            if (Wallet) {
                const updatedWallets = [...wallets, Wallet]
                setWallets(updatedWallets)
                setVisiblePrivateKeys([...visiblePrivateKeys, false])
                saveWalletKeys({ wallets: updatedWallets, mnemonics: mnemonicArray, pathTypes })
                toast.success("Wallet generated successfully")
            }
        }
    }
    const addNewWallet = () => {
        if (!mnemonicWords && pathTypes[0]) {
            toast.error("Generate the mnemonics first")
            return
        }
        const mnemonic = mnemonicWords.join(" ")
        const newWallet = createMemonicWallet({ mnemonic, pathTypes: pathTypes[0], index: wallets.length })
        if (newWallet) {
            const updatedWallets = [...wallets, newWallet]
            setWallets(updatedWallets)
            setVisiblePrivateKeys([...visiblePrivateKeys, false])
            saveWalletKeys({ wallets: updatedWallets, mnemonics: mnemonicWords, pathTypes })
            toast.success("Wallet Added")
        }

    }
    const clearWallets = () => {
        if (!clearWalletsKeys()) {
            console.error("Error in deletion of wallet keys")
            return
        }
        setWallets([])
        setPathtypes([])
        setMnemonicWords([])
        setVisiblePrivateKeys([])
        toast.success("Cleared all wallets successfully !!")
    }

    const deleteWallets = (index: number) => {
        const updatedWallets = wallets.filter((_, i) => i !== index)
        let updatedPathTypes
        if (updatedWallets?.length < 1) {
            updatedPathTypes = pathTypes.filter((
                _, i) => i !== index)
            setPathtypes(updatedPathTypes)
            setWallets(updatedWallets)
            saveWalletKeys({ wallets: updatedWallets, mnemonics: mnemonicWords, pathTypes: updatedPathTypes })
        } else {
            setWallets(updatedWallets)
            saveWalletKeys({ wallets: updatedWallets, mnemonics: mnemonicWords, pathTypes })

        }

        setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== index));
        toast.success("Deleted Wallet successfully !!")
    }


    return (
        <div className='flex flex-col gap-4'>
            {wallets.length == 0 && (<div className="flex flex-col gap-4">
                {pathTypes.length === 0 && (<WalletHome setPathtypes={setPathtypes} />)}
                {pathTypes.length !== 0 && (<InputRecoveryPhrase walletGenerate={walletGenerate} mnemonicInput={mnemonicInput} setMnemonicInput={setMnemonicInput} />)}

            </div>)}
            {wallets.length > 0 && mnemonicWords && (<DisplayRecoveryPhrase mnemonicWords={mnemonicWords} />)
            }
            {wallets.length > 0 && (<div className='flex flex-col gap-8 '>
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
                                        <Button variant="ghost" size="sm"><Trash size={18} color="#ff0000" />  </Button>
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
                            <div className='flex flex-col bg-secondary/50 px-8 py-6  cursor-pointer'>
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

            </div>)
            }

        </div>
    )
}
