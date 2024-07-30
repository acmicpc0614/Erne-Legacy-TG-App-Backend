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
const Earnings_1 = __importDefault(require("../../models/Earnings"));
const router = express_1.default.Router();
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new Earnings_1.default({
        username: req.body.username,
    });
    try {
        let username_check = yield Earnings_1.default.findOne({ username: req.body.username });
        if (username_check) {
            return res.json(username_check);
        }
        else {
            yield newUser.save();
            res.json(newUser);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}));
router.post("/update/joinTelegram/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Earnings_1.default.findOne({ username: req.params.username });
    if (user) {
        const updated_user = yield Earnings_1.default.findOneAndUpdate({ username: req.params.username }, { "joinTelegram.status": req.body.status, "joinTelegram.earned": req.body.earned });
        return res.status(200).json({ msg: "Update successfully!" });
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/update/subscribeTelegram/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Earnings_1.default.findOne({ username: req.params.username });
    if (user) {
        const updated_user = yield Earnings_1.default.findOneAndUpdate({ username: req.params.username }, { "subscribeTelegram.status": req.body.status, "subscribeTelegram.earned": req.body.earned });
        return res.status(200).json({ msg: "Update successfully!" });
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/update/followTwitter/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Earnings_1.default.findOne({ username: req.params.username });
    if (user) {
        const updated_user = yield Earnings_1.default.findOneAndUpdate({ username: req.params.username }, { "followTwitter.status": req.body.status, "followTwitter.earned": req.body.earned });
        return res.status(200).json({ msg: "Update successfully!" });
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield Earnings_1.default.findOne({ username: req.params.username });
    if (user) {
        res.json(user);
    }
    else {
        return res.status(400).json({ msg: "You not found" });
    }
}));
exports.default = router;
//# sourceMappingURL=earnings.js.map