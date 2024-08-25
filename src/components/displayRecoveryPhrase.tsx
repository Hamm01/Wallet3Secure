import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { copyToClipboard } from '../lib/utils'


interface RecoveryPhraseType {
    mnemonicWords: string[]
}
export const DisplayRecoveryPhrase: React.FC<RecoveryPhraseType> = ({ mnemonicWords }) => {
    const [showMemonic, setShowMemonic] = useState(false)



    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 my-10 border p-6 rounded-md'>
                <div className='content flex justify-between cursor-pointer' onClick={() => setShowMemonic(!showMemonic)}>
                    <h1 className="scroll-m-20 text-2xl font-semibold" >Secret Phrases</h1>
                    <Button size="icon" variant="ghost" onClick={() => setShowMemonic(!showMemonic)}>{showMemonic ? (<ChevronUp size={20} strokeWidth={1.5} />) : (<ChevronDown size={20} strokeWidth={1.5} />)}</Button>
                </div>
                {showMemonic && mnemonicWords.length > 0 && (
                    <div className="flex flex-col w-full justify-center"
                        onClick={() => copyToClipboard(mnemonicWords.join(" "))}><div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-4'>
                            {mnemonicWords.map((word, index) => (
                                <p key={index} className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4">{word}
                                </p>
                            ))}

                        </div>
                        <div className='flex items-center justify-start gap-2 cursor-pointer'> <Button size="icon" variant="ghost" ><Copy size={20} strokeWidth={2} /></Button> <p className='font-semibold'>Copy to clipboard</p></div>
                    </div>)}
            </div>
        </div>
    )
}

