import express, { Router, Request, Response } from "express";
import Wallet from "../../models/Wallet";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  // console.log("----------->wallet---->", req.body);
  const user_new = new Wallet({
    username: req.body.username,
  });
  try {
    const { username } = req.body;
    let user_check = await Wallet.findOne({ username });
    if (user_check) {
      return res.json(user_check);
    } else {
      await user_new.save();
      res.json(user_new);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.post("/update/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("update =>", req.body);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate({
      username: req.params.username,
      totalPoint: req.body.totalPoint,
      balance: req.body.balance,
    });
    console.log("--------------test----------", updated_wallet.totalPoint);
    const return_wallet = {
      _id: updated_wallet._id,
      username: updated_wallet.username,
      totalPoint: req.body.totalPoint,
      balance: req.body.balance,
      energy: req.body.energy,
      tap: updated_wallet.tap,
      limit: updated_wallet.limit,
      level: updated_wallet.level,
    };
    console.log("updated total =>", return_wallet.totalPoint);
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/updateEnergy/:username", async (req: Request, res: Response) => {
  try {
    // console.log(req.params.username);
    const wallet = await Wallet.findOne({ username: req.params.username });
    if (wallet) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: req.params.username },
        { energy: req.body.energy },
        { new: true } // Ensure the updated document is returned
      );
      // console.log("--------------test----------", updated_wallet);
      const return_wallet = {
        _id: updated_wallet._id,
        username: updated_wallet.username,
        balance: updated_wallet.balance,
        energy: req.body.energy,
        tap: updated_wallet.tap,
        limit: updated_wallet.limit,
        level: updated_wallet.level,
        totalPoint: updated_wallet.totalPoint,
      };
      return res.status(200).json(return_wallet);
    } else {
      return res.status(400).json({ msg: "You have no permission" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
router.post("/updateTap/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("updateTap =>", req.body);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      { tap: req.body.tap }
    );
    //   console.log("--------------test----------",updated_wallet);
    const return_wallet = {
      _id: updated_wallet._id,
      username: updated_wallet.username,
      balance: updated_wallet.balance,
      energy: updated_wallet.energy,
      tap: req.body.tap,
      limit: updated_wallet.limit,
      level: updated_wallet.level,
      totalPoint: updated_wallet.totalPoint,
    };
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});
/*
router.post("/updateLimit/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("updateLimit =>", req.body);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      { limit: req.body.limit }
    );
    //   console.log("--------------test----------",updated_wallet);
    const return_wallet = {
      _id: updated_wallet._id,
      username: updated_wallet.username,
      balance: updated_wallet.balance,
      energy: updated_wallet.energy,
      tap: updated_wallet.tap,
      limit: req.body.limit,
      level: updated_wallet.level,
      totalPoint: updated_wallet.totalPoint,
    };
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});
router.post("/updateBalance/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("updateBalance =>", req.body);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      { balance: req.body.balance }
    );
    //   console.log("--------------test----------",updated_wallet);
    const return_wallet = {
      _id: updated_wallet._id,
      username: updated_wallet.username,
      balance: req.body.balance,
      energy: updated_wallet.energy,
      tap: updated_wallet.tap,
      limit: updated_wallet.limit,
      level: updated_wallet.level,
      totalPoint: updated_wallet.totalPoint,
    };
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});
router.get("/all", async (req: Request, res: Response) => {
  const users = await Wallet.find().limit(5).sort({ balance: -1 });
  res.json(users);
});
router.post("/:username", async (req: Request, res: Response) => {
  let user = await Wallet.findOne({ username: req.params.username });
  if (user) {
    res.json(user);
  } else {
    return res.status(400).json({ msg: "You not found" });
  }
});
router.delete("/delete/:username", async (req: Request, res: Response) => {
  let wallet = await Wallet.findOne({ _id: req.params.username });
  if (!wallet) {
    return res.status(404).json({ msg: "User not found." });
  }
  await Wallet.deleteOne({ _id: req.params.username });
  res.json({ msg: "Delete Successfully" });
});
*/

router.post("/test", (req: Request, res: Response) => {
  res.send("wallet router is working...");
});
export default router;
