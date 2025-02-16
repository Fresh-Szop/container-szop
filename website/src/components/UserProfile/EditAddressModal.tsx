import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Address } from "@/types/API Responses"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PatchAddress } from "@/api/utils/patchAddress"
import { StatusCodes } from "http-status-codes"
import { AddressValidationSchema } from "@/constants"
import { fetchAddress } from "@/api/utils/fetchAddress"
import { Addresses } from "@/api/utils/fetchAllAddresses"
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query"

type EditModalProps = {
    name: string
    refetchAddresses: (options?: RefetchOptions) => Promise<QueryObserverResult<Error | Addresses, Error>>;
}

export function EditAddressModal({ name, refetchAddresses }: EditModalProps) {
    console.log(name)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<Address | null>(null)
    // const { data: addressData, isLoading } = useFetchAddress(name);

    const handleFetchData = async () => {
        const res = await fetchAddress(name);
        if (res.status === StatusCodes.OK) {
            setData(res.data)
        }
    }


    const handleSubmitEdit = async (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {

        const res = await PatchAddress(values);
        console.log(res, StatusCodes.OK)
        if (res.status === StatusCodes.OK) {
            refetchAddresses();
            setOpen(false);
            setSubmitting(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleFetchData} variant="outline" className="text-lg rounded-2xl bg-malachite-4 text-white py-2 px-4 hover:bg-malachite-6 hover:text-white">Edytuj adres</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edytuj adres</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Wprowadź zmiany w swoim adresie i kliknij "Zapisz&nbsp;zmiany"
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    enableReinitialize
                    initialValues={{
                        addressName: data?.addressName || '',
                        firstName: data?.firstName || '',
                        lastName: data?.lastName || '',
                        firstAddressLine: data?.firstAddressLine || '',
                        secondAddressLine: data?.secondAddressLine || '',
                        postalCode: data?.postalCode || '',
                        postalCity: data?.postalCity || '',
                        phoneNumber: data?.phoneNumber || '',
                    }}
                    validationSchema={AddressValidationSchema}
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
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="addressName" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="firstName" className="text-right text-2xl">
                                    Imię
                                </Label>
                                <Field
                                    id="firstName"
                                    name="firstName"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="firstName" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lastName" className="text-right text-2xl">
                                    Nazwisko
                                </Label>
                                <Field
                                    id="lastName"
                                    name="lastName"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="lastName" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="firstAddressLine" className="text-right text-2xl">
                                    Adres
                                </Label>
                                <Field
                                    id="firstAddressLine"
                                    name="firstAddressLine"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="firstAddressLine" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="secondAddressLine" className="text-right text-2xl">
                                    Adres cd.
                                </Label>
                                <Field
                                    id="secondAddressLine"
                                    name="secondAddressLine"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="secondAddressLine" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="postalCode" className="text-right text-2xl">
                                    Kod pocztowy
                                </Label>
                                <Field
                                    id="postalCode"
                                    name="postalCode"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="postalCode" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="postalCity" className="text-right text-2xl">
                                    Miasto
                                </Label>
                                <Field
                                    id="postalCity"
                                    name="postalCity"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="postalCity" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phoneNumber" className="text-right text-2xl">
                                    Numer telefonu
                                </Label>
                                <Field
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    as={Input}
                                    className="col-span-3"
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="text-blood-3 col-span-4 text-right" />
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
