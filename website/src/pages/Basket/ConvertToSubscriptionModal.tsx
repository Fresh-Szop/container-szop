import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { StatusCodes } from 'http-status-codes';
import { DICTIONARY } from '@/constants';
import { RefreshCcw } from 'lucide-react';
import { CreateSubscription } from '@/api/utils/createSubscription';


export function ConvertToSubscriptionModal() {
    const [open, setOpen] = useState(false);

    const handleConvertToSubscription = async () => {
        const res = await CreateSubscription();
        if (res.status === StatusCodes.CREATED) {
            setOpen(false);
            window.location.href = `/subscription/${res.data.subscriptionId}`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-2xl rounded-2xl font-bold flex items-center gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all"><RefreshCcw /> {DICTIONARY.CONVERT_TO_SUBSCRIPTION}</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] flex flex-col gap-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Tworzenie subskrypcji</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Czy na pewno chcesz zamienić koszyk na subskrypcję?<br />
                        Zawartość koszyka zostanie usunięta i zastąpiona subskrypcją.<br />
                        Subskrypcję trzeba aktywować przechodząc do zakładki "Subskrypcje".
                    </DialogDescription>
                </DialogHeader>
                <div className='flex w-full justify-center gap-8'>
                    <button onClick={handleConvertToSubscription} className="text-2xl w-48 rounded-2xl gap-8 px-4 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all">Tak</button>
                    <button onClick={() => { setOpen(false) }} className="text-2xl w-48 py-8 px-8 bg-blood-3 hover:bg-blood-5 transition-all rounded-2xl text-white">Anuluj</button>
                </div>
            </DialogContent>
        </Dialog>
    );
}