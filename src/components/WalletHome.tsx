import { Button } from "@/components/ui/button"
import { ChevronLast } from 'lucide-react'
type Props = {
    setPathtypes: React.Dispatch<React.SetStateAction<string[]>>
};
const WalletHome: React.FC<Props> = ({ setPathtypes }) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 my-5'>
                <h1 className="righteous-regular scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Power Your Crypto Journey: Ethereum & Solana, One Wallet</h1>
                <p className="scroll-m-20 pb-2 pt-2 text-2xl font-semibold tracking-tight first:mt-0"> Select Blockchain and Get Started</p>
                <div className='flex gap-2 mt-2'>
                    <Button size="lg" onClick={() => setPathtypes(["60"])} >Ethereum</Button>
                    <Button size="lg" onClick={() => setPathtypes(["501"])} >
                        Solana
                        <ChevronLast size={20} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WalletHome
