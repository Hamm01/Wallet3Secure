import { WalletType } from '../lib/types'
import { useState, useEffect } from "react"
import WalletHome from "./WalletHome"
import InputRecoveryPhrase from './InputRecoveryPhrase'
import { clearWalletsKeys, createMemonicWallet, fetchWallet, generateMnemonicWords, saveWalletKeys } from '../lib/walletFunctions'
import { DisplayRecoveryPhrase } from './displayRecoveryPhrase'
import { toast } from 'sonner'
import { DisplayWallets } from './displayWallets'


export default function CreateWallet() {
    const [wallets, setWallets] = useState<WalletType[]>([])
    const [pathTypes, setPathtypes] = useState<string[]>([])
    const [mnemonicWords, setMnemonicWords] = useState<string[]>(Array(12).fill(" "));
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
    const [mnemonicInput, setMnemonicInput] = useState<string>("")


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
        setVisiblePrivateKeys(visiblePrivateKeys.map((value, i) => i === index ? !value : value))
        return
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
            {wallets.length > 0 && (<DisplayWallets props={{ wallets, pathTypes, visiblePrivateKeys, addNewWallet, clearWallets, deleteWallets, toggleVisibility }} />)
            }

        </div>
    )
}
