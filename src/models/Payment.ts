import mongoose, { Schema, models } from 'mongoose';

const paymentGatewayDetailsSchema = new Schema(
    {
        gateway_name: { type: String },
        gateway_order_id: { type: String },
        gateway_payment_id: { type: String },
        gateway_order_reference_id: { type: String },
        gateway_status_code: { type: String },
        gateway_settlement: { type: String },
    },
    { _id: false }
);

const netbankingSchema = new Schema(
    {
        channel: { type: String },
        netbanking_bank_code: { type: Number },
        netbanking_bank_name: { type: String },
        netbanking_ifsc: { type: String },
        netbanking_account_number: { type: String },
    },
    { _id: false }
);

const paymentMethodSchema = new Schema(
    {
        netbanking: { type: netbankingSchema },
    },
    { _id: false }
);

const paymentSchema = new Schema(
    {
        auth_id: { type: String, default: null },
        authorization: { type: Schema.Types.Mixed, default: null },
        bank_reference: { type: String },
        cf_payment_id: { type: Number, required: true, unique: true, index: true },
        entity: { type: String, default: 'payment' },
        error_details: { type: Schema.Types.Mixed, default: null },
        is_captured: { type: Boolean, default: false },
        order_amount: { type: Number },
        order_id: { type: String, required: true, index: true },
        payment_amount: { type: Number },
        payment_completion_time: { type: Date },
        payment_currency: { type: String },
        payment_gateway_details: { type: paymentGatewayDetailsSchema },
        payment_group: { type: String },
        payment_message: { type: String },
        payment_method: { type: paymentMethodSchema },
        payment_offers: { type: Schema.Types.Mixed, default: null },
        payment_status: { type: String },
        payment_time: { type: Date },
    },
    {
        timestamps: true,
    }
);

export default models.Payment || mongoose.model('Payment', paymentSchema);
