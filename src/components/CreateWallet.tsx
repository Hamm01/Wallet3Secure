import { Button } from "@/components/ui/button"
// import { ChevronLast } from 'lucide-react'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WalletType } from '../lib/types'
import { useState } from "react"
import WalletHome from "./WalletHome"
import RecoveryPhrase from './RecoveryPhrase'
import { createMemonicWallet, generateMnemonicWords } from '../lib/walletFunctions'
import { Divide } from 'lucide-react'

export default function CreateWallet() {
    const [wallet, setWallet] = useState<WalletType[]>([])
    const [pathTypes, setPathtypes] = useState<string[]>([])
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(
        Array(12).fill(" ")
    );
    const [showMemonic, setShowMemonic] = useState(false)
    const [mnemonicInput, setMnemonicInput] = useState<string>("")

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
            const AccountIndex = wallet.length
            const Wallet = createMemonicWallet({
                mnemonic, pathTypes: stringCase, index: AccountIndex
            })
            if (Wallet) {
                const updatedWallets = [...wallet, Wallet]
                setWallet(updatedWallets)
            }
        }
    }


    return (
        <div className='flex flex-col gap-4'>
            {wallet.length == 0 && (<div className="flex flex-col gap-4">
                {pathTypes.length === 0 && (<WalletHome setPathtypes={setPathtypes} />)}
                {pathTypes.length !== 0 && (<RecoveryPhrase walletGenerate={walletGenerate} mnemonicInput={mnemonicInput} setMnemonicInput={setMnemonicInput} />)}

            </div>)}
            {wallet.length > 0 && mnemonicWords && (<div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 my-10 border p-6 rounded-md'>
                    <div className='content flex justify-between'>
                        <h1 className="scroll-m-20 text-2xl font-normal" >Secret Phrases</h1>
                        <Button size="icon" onClick={() => setShowMemonic(!showMemonic)}>{showMemonic ? (<ChevronUp size={20} strokeWidth={1.5} />) : (<ChevronDown size={20} strokeWidth={1.5} />)}</Button>
                    </div>
                    {showMemonic && mnemonicWords.length > 0 && (<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-8'>
                        {mnemonicWords.map((word, index) => (
                            <p key={index} className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4">{word}
                            </p>
                        ))}

                    </div>)}
                </div>
            </div>)
            }

        </div>
    )
}
