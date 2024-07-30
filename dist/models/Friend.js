"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FriendSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    friend: {
        type: String,
        required: true
    }
});
const Friend = (0, mongoose_1.model)("Friend", FriendSchema);
exports.default = Friend;
//# sourceMappingURL=Friend.js.map