import React, { useEffect, useState } from 'react'
import { CircleArrowUp, CircleCheck } from 'lucide-react'
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, LoadingButton } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendTransaction } from '../lib/walletFunctions'
import { toast } from "sonner"
import { error } from 'console'

interface SENDTRANSPARAMS {
    privKey: string;
    balance: string | number;
    type: string;
    isDarkMode: boolean
}

export const SendComponent: React.FC<SENDTRANSPARAMS> = ({ privKey, balance, type, isDarkMode }) => {

    const [toAddress, setToAddress] = useState("")
    const [loading, setLoading] = React.useState(false);
    const [amount, setAmount] = useState("")
    const [blockHash, setblockHash] = useState("")
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        setLoading(false)
        setToAddress("")
        setAmount("")
    }, [privKey, balance, type])

    async function doTransact({ toAddress, amount }: any) {
        setLoading(true)
        const response = await sendTransaction({ toAddress, senderPrivAddress: privKey, amount, type })

        if (response) {
            if (typeof (response) != "string" && response?.status) {
                setblockHash(response?.hash)
            } else if (typeof (response) === "string") {
                setblockHash(response)
            } else {
                console.error("Some Error in response field")
                return
            }
            setLoading(false)
            setIsOpen(true);
            setToAddress("")
            setAmount("")
            toast.success("Transaction Succesful!!")
        } else {
            setLoading(false)
            alert("Error in sending the transaction")
            throw error
        }

    }
    return (
        <div> <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost"><CircleArrowUp size={24} /></Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className='text-2xl righteous-regular tracking-normal '>Send {type} </DrawerTitle>

                        <DrawerDescription className='text-md font-semibold'>Please use public address and amount in {type === "Ethereum" ? 'eth' : 'sol'} </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex justify-end mb-2">
                            <h3 className='font-semibold'>Your wallet balance: {balance}</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label>To :</Label>
                            <Input autoComplete='false' placeholder={`${type} Public Adress`} className='p-6 pl-2 pr-2' value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
                            <Label>Amount in {type === "Ethereum" ? 'eth' : 'sol'} :</Label>
                            <Input placeholder={`Amount in ${type === "Ethereum" ? 'eth' : 'sol'} `} className='p-6 pl-2 pr-2' value={amount} onChange={(e) => setAmount(e.target.value)} />

                        </div>
                        <div className="mt-3 h-[20px]">

                        </div>
                    </div>
                    <DrawerFooter>
                        {Number(balance) <= 0 && <p className='text-destructive text-sm'>Send button disabled due to low balance *</p>}
                        <LoadingButton variant="default" loading={loading} onClick={() => doTransact({ toAddress, amount })} disabled={Number(balance) === 0}>
                            Send
                        </LoadingButton>
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle > </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {blockHash ? (
                                            <div className='flex flex-col justify-center items-center gap-4'>
                                                <CircleCheck size={100} color="#0de71c" />
                                                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white hover:text-primary/50' : 'text-primary hover:text-primary'}`}>

                                                    Transaction Successful with hash:{' '}
                                                    <span className="text-sm" style={{ wordBreak: 'break-all' }}>{blockHash}</span>
                                                </p>
                                                {type === "Ethereum" ? (<> <a className={`border p-2 text-center text-md font-semibold ${isDarkMode ? 'text-white hover:text-primary/50' : 'text-primary hover:text-primary/50'}`} target='_blank' href={`https://etherscan.io/tx/${blockHash}`}>Show on Explorer</a></>) : (<> <a className={`border p-2 text-center text-md font-semibold ${isDarkMode ? 'text-white hover:text-primary/50' : 'text-primary hover:text-primary/50'}`} target='_blank' href={`https://explorer.solana.com/tx/${blockHash}`}>Show on Explorer</a></>)}
                                            </div>
                                        ) : (
                                            <p>Your transaction has been processed successfully.</p>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer></div>
    )
}
