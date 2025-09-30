import mongoose, { Schema, models } from 'mongoose';

// Cashfree Payment/Order status values we commonly expect
const PAYMENT_STATUSES = [
  'CREATED',
  'PENDING',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
] as const;

type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// Individual payment attempt/transaction under an order
const transactionSchema = new Schema(
  {
    paymentId: { type: String }, // Cashfree payment_id
    status: { type: String },
    method: { type: String }, // card, upi, netbanking, wallet, etc.
    bankReference: { type: String }, // bank_ref_num / reference_id
    utr: { type: String },
    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    capturedAt: { type: Date },
    raw: { type: Schema.Types.Mixed, default: null }, // raw payload from Cashfree for this transaction
  },
  { _id: false }
);

// Webhook audit entries to track asynchronous updates from Cashfree
const webhookEventSchema = new Schema(
  {
    eventType: { type: String },
    receivedAt: { type: Date, default: Date.now },
    signature: { type: String },
    raw: { type: Schema.Types.Mixed, default: null },
  },
  { _id: false }
);

const paymentSchema = new Schema(
  {
    // Our order identifier sent to Cashfree (order_id)
    orderId: { type: String, required: true, unique: true, index: true },

    // Cashfree payment session id used on client to open checkout
    paymentSessionId: { type: String, required: false, index: true },

    // Monetary details
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    // Status lifecycle of the order
    status: { type: String, enum: PAYMENT_STATUSES, default: 'CREATED' as PaymentStatus },

    // Optional association to a Venue created via onboarding
    venueId: { type: Schema.Types.ObjectId, ref: 'Venue', required: false },

    // Customer details used when creating the order
    customer: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },

    // Additional metadata
    orderNote: { type: String },
    orderMeta: {
      return_url: { type: String },
      notify_url: { type: String },
      payment_methods: { type: String },
    },

    // Transactions and webhooks
    transactions: { type: [transactionSchema], default: [] },
    webhooks: { type: [webhookEventSchema], default: [] },

    // Raw Cashfree responses for debugging/audit
    raw: { type: Schema.Types.Mixed, default: null },

    // Generic flags
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default models.Payment || mongoose.model('Payment', paymentSchema);


