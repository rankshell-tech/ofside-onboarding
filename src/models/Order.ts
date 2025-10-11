import mongoose, { Schema, models } from 'mongoose';

const ORDER_STATUSES = [
  'ACTIVE',
  'PENDING',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

const customerDetailsSchema = new Schema(
  {
    customer_id: { type: String },
    customer_name: { type: String, default: null },
    customer_email: { type: String },
    customer_phone: { type: String },
    customer_uid: { type: String, default: null },
  },
  { _id: false }
);

const orderMetaSchema = new Schema(
  {
    return_url: { type: String },
    notify_url: { type: String, default: null },
    payment_methods: { type: String, default: null },
  },
  { _id: false }
);

const urlSchema = new Schema(
  {
    url: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    cf_order_id: { type: Number, required: true, unique: true, index: true },
    created_at: { type: Date, required: true },
    customer_details: { type: customerDetailsSchema, required: true },
    entity: { type: String, default: 'order' },
    order_amount: { type: Number, required: true },
    order_currency: { type: String, default: 'INR' },
    order_expiry_time: { type: Date },
    order_id: { type: String, required: true, unique: true, index: true },
    order_meta: { type: orderMetaSchema },
    order_note: { type: String },
    order_splits: { type: [Schema.Types.Mixed], default: [] },
    order_status: { type: String, enum: ORDER_STATUSES, default: 'ACTIVE' as OrderStatus },
    order_tags: { type: Schema.Types.Mixed, default: null },
    payment_session_id: { type: String },
    payments: { type: urlSchema },
    refunds: { type: urlSchema },
    settlements: { type: urlSchema },
    terminal_data: { type: Schema.Types.Mixed, default: null },
    raw: { type: Schema.Types.Mixed, default: null },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default models.Order || mongoose.model('Order', orderSchema);
