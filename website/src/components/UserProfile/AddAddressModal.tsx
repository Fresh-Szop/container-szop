import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { PostNewAddress } from '@/api/utils/postNewAddress';
import { StatusCodes } from 'http-status-codes';
import { AddressValidationSchema } from '@/constants';
import { Addresses } from '@/api/utils/fetchAllAddresses';
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

interface AddAddressModalProps {
    refetchAddresses: (options?: RefetchOptions) => Promise<QueryObserverResult<Error | Addresses, Error>>;
}

export function AddAddressModal({ refetchAddresses }: AddAddressModalProps) {
    const [open, setOpen] = useState(false);

    const handleSubmitAdd = async (values: any) => {
        const res = await PostNewAddress(values);
        console.log(res);
        if (res === StatusCodes.CREATED) {
            refetchAddresses();
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-lg rounded-2xl bg-malachite-4 text-white py-2 px-4 hover:bg-malachite-6 hover:text-white">Dodaj adres</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Dodaj adres</DialogTitle>
                    <DialogDescription className="text-2xl">
                        Wprowadź dane nowego adresu i kliknij "Stwórz"
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{
                        addressName: '',
                        firstName: '',
                        lastName: '',
                        firstAddressLine: '',
                        secondAddressLine: '',
                        postalCode: '',
                        postalCity: '',
                        phoneNumber: '',
                    }}
                    validationSchema={AddressValidationSchema}
                    onSubmit={handleSubmitAdd}
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
                                    placeholder="Tytuł adresu"
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
                                    placeholder="Wprowadź imię"
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
                                    placeholder="Wprowadź nazwisko"
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
                                    placeholder="Wprowadź adres"
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
                                    placeholder="Wprowadź adres cd."
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
                                    placeholder="Wprowadź kod pocztowy"
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
                                    placeholder="Wprowadź miasto"
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
                                    placeholder="Wprowadź numer telefonu"
                                    className="col-span-3"
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="text-blood-3 col-span-4 text-right" />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting} className="text-2xl py-8 px-8 bg-malachite-4 hover:bg-malachite-6 transition-all">
                                    Stwórz
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}