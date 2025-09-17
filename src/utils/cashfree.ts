// eslint-disable-next-line 
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";

// Initialize SDK
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeSDK = async function (): Promise<any> {
    const sdk = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
    });
    return sdk;
};

// Start payment
export async function initiatePayment(paymentSessionId: string) {
    const sdk = await initializeSDK();

    sdk.checkout({
        paymentSessionId,
        redirectTarget: "_modal", // "_self" for redirect
    });
}
