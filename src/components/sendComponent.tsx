import React, { useState } from 'react'
import { CircleArrowUp } from 'lucide-react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
export const SendComponent: React.FC = () => {

    const [toAddress, setToAddress] = useState("")
    const [amount, setAmount] = useState("")

    return (
        <div> <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost"><CircleArrowUp size={24} /></Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Send Ethereum </DrawerTitle>
                        <DrawerDescription>Please use public address and amount in eth </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex flex-col gap-4">

                            <Input placeholder='Ethereum Public Address' className='p-6 ' value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
                            <Input placeholder='Amount in Eth' className='p-6 ' value={amount} onChange={(e) => setAmount(e.target.value)} />

                        </div>
                        <div className="mt-3 h-[50px]">

                        </div>
                    </div>
                    <DrawerFooter>
                        <Button>  Send</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer></div>
    )
}
