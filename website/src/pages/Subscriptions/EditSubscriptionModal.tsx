import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { StatusCodes } from "http-status-codes"
import { useFetchAllAddresses } from "@/api/hooks/useFetchAllAddresses"
import { Pencil } from "lucide-react"
import { SubscriptionStatus } from "@/types/Dictionaries"
import * as Yup from 'yup';
import { PatchSubscription } from "@/api/utils/patchSubscription";
import { Address } from "@/types/API Responses";
import { AddAddressModal } from "@/components/UserProfile/AddAddressModal";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

type EditModalProps = {
    data: { status: string, addressName: string, frequency: number, id: number },
    refetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

const SubscriptionValidationSchema = Yup.object().shape({
    addressName: Yup.string().required("Nazwa adresu jest wymagana"),
    status: Yup.string().required("Status jest wymagany"),
    frequency: Yup.number().required("Częstotliwość jest wymagana").min(1, "Częstotliwość musi być większa od 0").max(24, "Częstotliwość nie może być większa niż 24"),
})

export function EditSubscriptionModal({ data, refetchData }: EditModalProps) {
    const [open, setOpen] = useState(false)
    const { data: addressesData, isLoading, refetch } = useFetchAllAddresses();

    const handleSubmitEdit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        console.log(values);
        const res = await PatchSubscription(values, data.id);
        console.log(res)
        if (res.status === StatusCodes.OK) {
            setOpen(false);
            refetchData();
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-2xl rounded-2xl font-bold flex items-center gap-8 px-12 py-4 border border-verdigris-4 bg-verdigris-4 text-white hover:bg-verdigris-6 hover:border-verdigris-6 transition-all">
                    <Pencil />Edytuj</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edytuj subskrypcję</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Wprowadź zmiany w swojej subskrypcji i kliknij "Zapisz&nbsp;zmiany"
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    enableReinitialize
                    initialValues={{
                        addressName: data.addressName,
                        status: data.status,
                        frequency: data.frequency,
                    }}
                    validationSchema={SubscriptionValidationSchema}
                    onSubmit={handleSubmitEdit}
                >
                    {({ isSubmitting }) => (
                        <Form className="grid gap-8 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="addressName" className="text-right text-2xl">
                                    Nazwa adresu
                                </Label>
                                <Field
                                    id="addressName"
                                    name="addressName"
                                    as="select"
                                    className="col-span-3 border px-4 py-4 text-xl rounded-2xl"
                                >
                                    <option value="">Wybierz adres</option>
                                    {addressesData.map((address: Address, index: number) => (
                                        <option key={index} value={address.addressName}>
                                            {address.addressName}
                                        </option>
                                    ))}
                                </Field>

                                <ErrorMessage name="addressName" component="div" className="text-blood-3 col-span-4 text-right" />
                                <div className="col-start-4 flex justify-end">
                                    <AddAddressModal refetchAddresses={refetch} />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right text-2xl">
                                    Status
                                </Label>
                                <Field
                                    id="status"
                                    name="status"
                                    as="select"
                                    className="col-span-3 border px-4 py-4 text-xl rounded-2xl"
                                >
                                    {Object.entries(SubscriptionStatus).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="status" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="frequency" className="text-right text-2xl">
                                    Częstotliwość
                                </Label>
                                <Field
                                    id="frequency"
                                    name="frequency"
                                    type="number"
                                    className="col-span-3 border px-4 py-4 text-xl rounded-2xl"
                                />
                                <ErrorMessage name="frequency" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting} className="text-2xl py-8 px-8 bg-malachite-4 hover:bg-malachite-6 transition-all">
                                    Zapisz zmiany
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}