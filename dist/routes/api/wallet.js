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
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const router = express_1.default.Router();
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("----------->wallet---->", req.body);
    const user_new = new Wallet_1.default({
        username: req.body.username,
    });
    try {
        const { username } = req.body;
        let user_check = yield Wallet_1.default.findOne({ username });
        if (user_check) {
            return res.json(user_check);
        }
        else {
            yield user_new.save();
            res.json(user_new);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}));
router.post("/update/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { balance: req.body.balance, energy: req.body.energy });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: updated_wallet._id,
            username: updated_wallet.username,
            balance: req.body.balance,
            energy: req.body.energy,
            tap: updated_wallet.tap,
            limit: updated_wallet.limit,
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateEnergy/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { energy: req.body.energy });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: updated_wallet._id,
            username: updated_wallet.username,
            balance: updated_wallet.balance,
            energy: req.body.energy,
            tap: updated_wallet.tap,
            limit: updated_wallet.limit,
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateTap/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { tap: req.body.tap });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: updated_wallet._id,
            username: updated_wallet.username,
            balance: updated_wallet.balance,
            energy: updated_wallet.energy,
            tap: req.body.tap,
            limit: updated_wallet.limit,
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateLimit/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { limit: req.body.limit });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: updated_wallet._id,
            username: updated_wallet.username,
            balance: updated_wallet.balance,
            energy: updated_wallet.energy,
            tap: updated_wallet.tap,
            limit: req.body.limit,
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateBalance/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("requeset", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { balance: req.body.balance });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = {
            _id: updated_wallet._id,
            username: updated_wallet.username,
            balance: req.body.balance,
            energy: updated_wallet.energy,
            tap: updated_wallet.tap,
            limit: updated_wallet.limit,
        };
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Wallet_1.default.find().limit(5).sort({ 'balance': -1 });
    res.json(users);
}));
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield Wallet_1.default.findOne({ username: req.params.username });
    if (user) {
        res.json(user);
    }
    else {
        return res.status(400).json({ msg: "You not found" });
    }
}));
router.delete("/delete/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield Wallet_1.default.findOne({ _id: req.params.username });
    if (!wallet) {
        return res.status(404).json({ msg: "User not found." });
    }
    yield Wallet_1.default.deleteOne({ _id: req.params.username });
    res.json({ msg: "Delete Successfully" });
}));
exports.default = router;
//# sourceMappingURL=wallet.js.map