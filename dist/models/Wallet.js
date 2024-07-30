"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    energy: {
        type: Number,
        default: 1000
    },
    tap: {
        type: Number,
        default: 1
    },
    limit: {
        type: Number,
        default: 1000
    }
});
const Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
exports.default = Wallet;
//# sourceMappingURL=Wallet.js.map