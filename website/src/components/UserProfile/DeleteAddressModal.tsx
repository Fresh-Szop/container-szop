import { DeleteAddress } from "@/api/utils/deleteAddress"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { StatusCodes } from "http-status-codes"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Addresses } from "@/api/utils/fetchAllAddresses"

interface DeleteAddressModalProps {
    addressName: string
    refetchAddresses: (options?: RefetchOptions) => Promise<QueryObserverResult<Error | Addresses, Error>>;
}

export function DeleteAddressModal({ addressName, refetchAddresses }: DeleteAddressModalProps) {
    const [open, setOpen] = useState(false)

    const handleSubmitDelete = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const res = await DeleteAddress(addressName);
        if (res.status === StatusCodes.NO_CONTENT) {
            refetchAddresses();
            setOpen(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-lg rounded-2xl text-white py-2 px-4 bg-blood-3 hover:bg-blood-5 hover:text-white">Usuń</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Usuń adres</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Czy na pewno chcesz usunąć ten adres?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={handleSubmitDelete} type="button" className="text-2xl py-8 px-8 bg-blood-3 hover:bg-blood-5 transition-all">Usuń</Button>
                    <Button onClick={() => { setOpen(false) }} type="button" className="text-2xl py-8 px-8 bg-malachite-4 hover:bg-malachite-6 transition-all">Anuluj</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
