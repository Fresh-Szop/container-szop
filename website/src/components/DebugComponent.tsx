import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "./ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { useRef, useState } from "react"
import { UpdateOrderStatus } from "@/api/utils/updateOrderStatus"
import { toast } from "react-toastify"
import { UpdateProductQuantity } from "@/api/utils/updateProductQuantity"
import { UpdateSubscriptionTick } from "@/api/utils/updateSubscriptionTick"
import { fetchSubscriptionsList } from "@/api/utils/fetchSubscriptionsList"
export const DebugComponent = () => {
    const shouldRender = true;
    const orderID = useRef<HTMLInputElement>(null)
    const [orderStatus, setOrderStatus] = useState<string>("")
    const productID = useRef<HTMLInputElement>(null)
    const subscriptionID = useRef<HTMLInputElement>(null)
    const productQuantity = useRef<HTMLInputElement>(null)
    const handleUpdateOrderStatus = async () => {
        const orderIDValue = orderID.current?.value ? parseInt(orderID.current.value, 10) : undefined;
        if (orderIDValue !== undefined) {
            await UpdateOrderStatus(orderIDValue, orderStatus);
        } else {
            toast.error("Order ID is required");
        }
    }
    const handleStatusSelectChange = (value: string) => {
        setOrderStatus(value);
    }
    const handleUpdateProductQuantity = async () => {
        const productIDValue = productID.current?.value ? parseInt(productID.current.value, 10) : undefined;
        const productQuantityValue = productQuantity.current?.value ? parseInt(productQuantity.current.value, 10) : undefined;
        if (productIDValue !== undefined && productQuantityValue !== undefined) {
            await UpdateProductQuantity(productIDValue, productQuantityValue);
        } else {
            toast.error("Product ID and Quantity are required");
        }
    }

    const handleForceSubscriptionTick = async () => {
        const subscriptionIDValue = subscriptionID.current?.value ? parseInt(subscriptionID.current.value, 10) : undefined;
        if (subscriptionIDValue !== undefined) {
            await UpdateSubscriptionTick(subscriptionIDValue);
        } else {
            toast.error("Subscription ID is required");
        }
    }

    const handleFetchSubscriptionsList = async () => {
        await fetchSubscriptionsList();
    }
    return (shouldRender &&
        <div className="bg-gray-200 p-2 absolute top-0 left-0 z-50 bg-white rounded-lg">
            <h1 className="text-2xl font-bold">Develop Component</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" >
                    <AccordionTrigger>Update Order Status</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        <Input type="text" placeholder="Order ID" id="orderID" ref={orderID} />
                        <Select onValueChange={handleStatusSelectChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateOrderStatus}>Update</Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" >
                    <AccordionTrigger>Update Product Quantity</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        <Input type="text" placeholder="Product ID" id="productID" ref={productID} />
                        <Input type="text" placeholder="Quantity" id="quantity" ref={productQuantity} />
                        <Button onClick={handleUpdateProductQuantity}>Update</Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" >
                    <AccordionTrigger>Get Subscriptions List</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        <Button onClick={handleFetchSubscriptionsList}>Fetch subscriptions list</Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" >
                    <AccordionTrigger>Force Subscription Tick</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        <Input type="text" placeholder="Subscription ID" id="subscriptionID" ref={subscriptionID} />
                        <Button onClick={handleForceSubscriptionTick}>Update</Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}