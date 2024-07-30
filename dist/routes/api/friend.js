"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Friend_1 = __importDefault(require("../../models/Friend"));
const router = express_1.default.Router();
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const friend_new = new Friend_1.default({
        username: req.body.username,
        friend: req.body.friend
    });
    try {
        let friend_check = yield Friend_1.default.findOne({ friend: req.body.friend });
        if (friend_check) {
            return res.status(400).json({ msg: "You are already added in friend item" });
        }
        else {
            yield friend_new.save();
            res.json(friend_new);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}));
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let friend = yield Friend_1.default.find({ username: req.params.username });
    if (friend) {
        res.json(friend);
    }
    else {
        return res.status(400).json({ msg: "No Friends" });
    }
}));
exports.default = router;
//# sourceMappingURL=friend.js.map