import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongo";
import Payment from "@/models/Payment";

const CASHFREE_BASE =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const CASHFREE_APP_ID =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? process.env.CASHFREE_APP_ID!
    : process.env.CASHFREE_APP_ID_TEST!;

const CASHFREE_SECRET_KEY =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? process.env.CASHFREE_SECRET_KEY!
    : process.env.CASHFREE_SECRET_KEY_TEST!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
  }

  try {
    // Step 1: Fetch all payments for this order from Cashfree
    const res = await fetch(`${CASHFREE_BASE}/orders/${orderId}/payments`, {
      method: "GET",
      headers: {
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const payments = await res.json();

    if (!Array.isArray(payments) || payments.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No payments found for this order",
      }, { status: 404 });
    }

    // Step 2: Pick the latest payment attempt
    const latestPayment = payments[payments.length - 1];

    // Step 3: Save/update payment data in MongoDB
    await connectToDB();

    // Prepare update data
    const updateData = {
      auth_id: latestPayment.auth_id,
      authorization: latestPayment.authorization,
      bank_reference: latestPayment.bank_reference,
      entity: latestPayment.entity,
      error_details: latestPayment.error_details,
      is_captured: latestPayment.is_captured,
      order_amount: latestPayment.order_amount,
      order_id: latestPayment.order_id,
      payment_amount: latestPayment.payment_amount,
      payment_currency: latestPayment.payment_currency,
      payment_gateway_details: latestPayment.payment_gateway_details,
      payment_group: latestPayment.payment_group,
      payment_message: latestPayment.payment_message,
      payment_method: latestPayment.payment_method,
      payment_offers: latestPayment.payment_offers,
      payment_status: latestPayment.payment_status,
      cf_payment_id: latestPayment.cf_payment_id,
    };

 

    console.log("Attempting to save payment with cf_payment_id:", latestPayment.cf_payment_id);
    console.log("Order ID:", latestPayment.order_id);

    try {
      // First, try to find if payment already exists
      const existingPayment = await Payment.findOne({ 
        cf_payment_id: latestPayment.cf_payment_id 
      });

      if (existingPayment) {
        // Update existing payment
        await Payment.updateOne(
          { cf_payment_id: latestPayment.cf_payment_id },
          { $set: updateData }
        );
        console.log("Updated existing payment");
      } else {
        // Create new payment - handle potential index conflicts
        try {
          await Payment.create(updateData);
          console.log("Created new payment");
        } catch (createError) {
          if (
            typeof createError === "object" &&
            createError !== null &&
            "code" in createError &&
            (createError as { code?: unknown }).code === 11000
          ) {
            console.log("Duplicate key on create, attempting upsert instead...");
            // Fallback to upsert with different approach
            await Payment.findOneAndUpdate(
              { cf_payment_id: latestPayment.cf_payment_id },
              { $set: updateData },
              { 
                upsert: true, 
                new: true,
                // Explicitly set which index to use
                hint: { cf_payment_id: 1 }
              }
            );
          } else {
            throw createError;
          }
        }
      }
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      
      // Final fallback - use update with upsert and explicit index hint
      if (
        typeof dbError === "object" &&
        dbError !== null &&
        "code" in dbError &&
        (dbError as { code?: unknown }).code === 11000
      ) {
        console.log("Final fallback: Using updateOne with upsert");
        await Payment.updateOne(
          { cf_payment_id: latestPayment.cf_payment_id },
          { $set: updateData },
          { upsert: true }
        );
      } else {
        throw dbError;
      }
    }

    // Step 4: Return latest payment info
    return NextResponse.json({
      success: true,
      rawResponse: latestPayment,
      order_id: orderId,
      payment_status: latestPayment.payment_status,
      payment_message: latestPayment.payment_message,
      payment_amount: latestPayment.payment_amount,
      payment_time: latestPayment.payment_time,
      payment_method: latestPayment.payment_method,
    });
  } catch (err) {
    console.error("Payment status fetch failed:", err);
    return NextResponse.json({
      success: false,
      error: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message || "Failed to fetch or save payment status" : "Failed to fetch or save payment status",
    }, { status: 500 });
  }
}