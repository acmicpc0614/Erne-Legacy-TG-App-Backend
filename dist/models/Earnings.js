"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EarningsSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    joinTelegram: {
        status: {
            type: Boolean,
            default: false,
        },
        earned: {
            type: Boolean,
            default: false,
        },
    },
    subscribeTelegram: {
        status: {
            type: Boolean,
            default: false,
        },
        earned: {
            type: Boolean,
            default: false,
        },
    },
    followTwitter: {
        status: {
            type: Boolean,
            default: false,
        },
        earned: {
            type: Boolean,
            default: false,
        },
    },
});
const Earnings = (0, mongoose_1.model)("Earnings", EarningsSchema);
exports.default = Earnings;
//# sourceMappingURL=Earnings.js.map