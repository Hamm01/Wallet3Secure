import { WalletType } from '../lib/types'
import { useState, useEffect } from "react"
import WalletHome from "./WalletHome"
import InputRecoveryPhrase from './InputRecoveryPhrase'
import { createMemonicWallet, fetchWallet, generateMnemonicWords, saveWalletKeys } from '../lib/walletFunctions'
import { DisplayRecoveryPhrase } from './displayRecoveryPhrase'
import { Button } from './ui/button'
import { copyToClipboard } from '../lib/utils'
import { EyeOff, Eye, Trash } from 'lucide-react'
import { toast } from 'sonner'


export default function CreateWallet() {
    const [wallets, setWallets] = useState<WalletType[]>([])
    const [pathTypes, setPathtypes] = useState<string[]>([])
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(
        Array(12).fill(" ")
    );
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
    const [mnemonicInput, setMnemonicInput] = useState<string>("")


    useEffect(() => {
        const storedkeys = fetchWallet()
        if (storedkeys) {
            const { wallet, mnemonics, pathTypes } = storedkeys
            setPathtypes(pathTypes)
            setMnemonicWords(mnemonics)
            setWallets(wallet)
            setVisiblePrivateKeys(wallet.map(() => false))
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
                saveWalletKeys({ wallet: updatedWallets, mnemonics: mnemonicArray, pathTypes })
                toast.success("Wallet generated successfully")
            }
        }
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
                        <Button size="sm" >Add Wallet</Button>
                        <Button variant="destructive" size="sm">Clear Wallets</Button>
                    </div>
                </div>
                <div className="grid grid-col-1 col-span-1 gap-4">
                    {wallets.map((wallet: WalletType, index: number) => (
                        <div className="flex flex-col border border-primary/50 rounded-md" key={index}>
                            <div className="flex justify-between px-8 py-6">
                                <h2 className='righteous-regular scroll-m-20 lg:text-3xl font-semibold'>Wallet {index + 1}</h2>
                                <Button variant="ghost" size="sm"><Trash size={18} color="#ff0000" />  </Button>
                            </div>
                            <div className='flex flex-col bg-secondary/50 px-8 py-6  cursor-pointer'>
                                <div className="publickey flex flex-col w-full gap-2" onClick={() => copyToClipboard(wallet?.publicKey)}>
                                    <span className="text-xl font-bold tracking-tighter">Public Key</span>
                                    <p className="text-primary/80 font-medium cursor-pointer hover:text-primary">
                                        {wallet.publicKey}</p>

                                </div>
                                <div className="publickey flex flex-col w-full gap-2" >
                                    <span className="text-xl font-bold tracking-tighter">Private Key</span>
                                    <div className="flex justify-between w-full items-center gap-2">
                                        <p className="text-primary/80 font-medium cursor-pointer hover:text-primary" onClick={() => copyToClipboard(wallet?.privateKey)}>
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
