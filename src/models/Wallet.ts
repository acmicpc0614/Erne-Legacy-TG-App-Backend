import { Schema, model } from "mongoose";

const WalletSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  totalPoint: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  energy: {
    type: Number,
    default: 1000,
  },
  tap: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 1000,
  },
  level: {
    type: Number,
    default: 1,
  },
});
const Wallet = model("Wallet", WalletSchema);

export default Wallet;
