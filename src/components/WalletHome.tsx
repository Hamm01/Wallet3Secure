import { Button } from "@/components/ui/button"
import { ChevronLast } from 'lucide-react'
import { motion as m } from 'framer-motion'
type Props = {
    setPathtypes: React.Dispatch<React.SetStateAction<string[]>>
};
const WalletHome: React.FC<Props> = ({ setPathtypes }) => {
    return (
        <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                ease: "easeInOut"
            }}
            className='flex flex-col gap-4'>
            <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }} className='flex flex-col gap-2 my-12'>
                <h1 className="righteous-regular scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Power Your Crypto Journey: Ethereum & Solana, One Wallet</h1>
                <p className="scroll-m-20 pb-2 pt-2 text-2xl font-semibold tracking-tight first:mt-0"> Select Blockchain and Get Started</p>
                <div className='flex gap-2 mt-2'>
                    <Button size="lg" onClick={() => setPathtypes(["60"])} >Ethereum</Button>
                    <Button size="lg" onClick={() => setPathtypes(["501"])} >
                        Solana
                        <ChevronLast size={20} />
                    </Button>
                </div>
            </m.div>
        </m.div>
    )
}

export default WalletHome
