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
import { DeleteSubscription } from "@/api/utils/deleteSubscription"
import { Trash2 } from "lucide-react"



export function DeleteSubscriptionModal({ id }: { id: number }) {
    const [open, setOpen] = useState(false)

    const handleSubmitDelete = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const res = await DeleteSubscription(id);
        if (res.status === StatusCodes.NO_CONTENT) {
            setOpen(false);
            window.location.assign("/subscriptions")
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-2xl rounded-2xl font-bold flex items-center gap-8 px-12 py-4 border border-blood-4 bg-blood-4 text-white hover:bg-blood-6 hover:border-blood-6 transition-all"><Trash2 />Usuń</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Usuń subskrypcję</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Czy na pewno chcesz usunąć tą subskrypcję?
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
