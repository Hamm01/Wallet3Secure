
// import { ChevronLast } from 'lucide-react'

import { WalletType } from '../lib/types'
import { useState } from "react"
import WalletHome from "./WalletHome"
import InputRecoveryPhrase from './InputRecoveryPhrase'
import { createMemonicWallet, generateMnemonicWords } from '../lib/walletFunctions'
import { Divide } from 'lucide-react'
import { DisplayRecoveryPhrase } from './displayRecoveryPhrase'

export default function CreateWallet() {
    const [wallet, setWallet] = useState<WalletType[]>([])
    const [pathTypes, setPathtypes] = useState<string[]>([])
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(
        Array(12).fill(" ")
    );

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
                {pathTypes.length !== 0 && (<InputRecoveryPhrase walletGenerate={walletGenerate} mnemonicInput={mnemonicInput} setMnemonicInput={setMnemonicInput} />)}

            </div>)}
            {wallet.length > 0 && mnemonicWords && (<DisplayRecoveryPhrase mnemonicWords={mnemonicWords} />)
            }

        </div>
    )
}
