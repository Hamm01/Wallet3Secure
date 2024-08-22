
import { ModeToggle } from '@/components/mode-toggle'
import { ShieldPlus } from 'lucide-react';;

export default function Navbar() {
    return (
        <nav className='flex flex-row py-4 justify-between items-center'>
            <div className="flex items-start gap-2">
                <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight">
                    Wallet3Secure
                </h3>
                <ShieldPlus size={24} />
            </div>
            <ModeToggle />
        </nav>
    )
}
