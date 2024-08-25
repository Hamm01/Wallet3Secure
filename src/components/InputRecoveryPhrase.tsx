import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
    walletGenerate: () => void,
    mnemonicInput: string,
    setMnemonicInput: React.Dispatch<React.SetStateAction<string>>
};
const InputRecoveryPhrase: React.FC<Props> = ({ walletGenerate, mnemonicInput, setMnemonicInput }) => {
    return (
        <div className='flex flex-col gap-4 my-5'>
            <div className='flex flex-col gap-2'>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Wallet Recovery Phrase</h1>
                <p className="scroll-m-20 pb-2 pt-2 text-2xl font-semibold tracking-tight first:mt-0"> Copy the words at safe place</p>
            </div>
            <div className='flex gap-2'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Input type="mnemonics" className='p-5 focus:border-black focus:ring-0 focus:outline-none focus:border-1 ' placeholder="Enter Your Secret Phrase" value={mnemonicInput} onChange={(e) => setMnemonicInput(e.target.value)} />
                        </TooltipTrigger>
                        <TooltipContent side='bottom' sideOffset={20}>
                            <p className='text-xl'>In case no secret phrase : Leave it blank and press Generate Wallet </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>


                <Button className='h-10 px-12' onClick={walletGenerate}>Generate Wallet</Button>
            </div>
        </div>
    )
}

export default InputRecoveryPhrase