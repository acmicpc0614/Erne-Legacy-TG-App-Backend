import express, { Router, Request, Response } from "express";
import Wallet from "../../models/Wallet";
import { getBounsFromPassItem, updateLevel } from "../../utils/helper";
import { PassItemCount } from "../../utils/levelData";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  const user_new = new Wallet({
    username: req.body.username,
  });

  try {
    const { username } = req.body;
    console.log("=======  add =====>", username);
    let user_check = await Wallet.findOne({ username });
    if (user_check && username) {
      let nowTime = Date.now();
      // console.log("nowTime =>", nowTime);
      const passItemEarn =
        (nowTime - user_check.lastTime) *
        PassItemCount[user_check.passItemLevel];
      // console.log("passItemEarn =>", passItemEarn);
      const updated_wallet = await Wallet.findOneAndUpdate(
        {
          username: req.body.username,
        },
        {
          totalPoint: req.body.totalPoint,
          balance: req.body.balance + passItemEarn,
          lastTime: nowTime,
        }
      );
      // console.log("aftTime =>", updated_wallet.lastTime);
      return res.json(updated_wallet);
    } else {
      await user_new.save();
      res.json(user_new);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.post("/update/:username", async (req: Request, res: Response) => {
  console.log("=======  update/:username =====>");
  const wallet = await Wallet.findOne({ username: req.params.username });
  updateLevel(req.params.username, req.body.totalPoint);
  const passItemEarn =
    (Date.now() - wallet.lastTime) * PassItemCount[wallet.passItemLevel];
  // console.log("passItemEarn =>", passItemEarn);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      {
        username: req.params.username,
      },
      {
        totalPoint: req.body.totalPoint + passItemEarn,
        balance: req.body.balance + passItemEarn,
        lastTime: Date.now(),
      }
    );
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });

    // console.log("updated total =>", return_wallet);
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/updateEnergy/:username", async (req: Request, res: Response) => {
  console.log("=======  updateEnergy/:username =====>");
  try {
    // console.log(req.params.username);
    const wallet = await Wallet.findOne({ username: req.params.username });
    if (wallet) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: req.params.username },
        { energy: req.body.energy } // Ensure the updated document is returned
      );
      // console.log("--------------test----------", updated_wallet);
      const return_wallet = await Wallet.findOne({
        username: req.params.username,
      });
      return res.status(200).json(return_wallet);
    } else {
      return res.status(400).json({ msg: "You have no permission" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    // console.log("updateEnergy called =>", Date.now());
  }
});
router.post("/updateTap/:username", async (req: Request, res: Response) => {
  console.log("=======  updateTap/:username =====>");
  const wallet = await Wallet.findOne({ username: req.params.username });
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      { tap: req.body.tap }
    );
    //   console.log("--------------test----------",updated_wallet);
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/buyBonusCard/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  // console.log("=======  buyBonusCard/:username =====>", wallet);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      {
        passItemLevel: req.body.passItemLevel,
        passItemStartTime: Date.now(),
        balance: req.body.token,
      }
    );
    // console.log("--------------test----------", updated_wallet);
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });
    return res.status(200).json(return_wallet);
  } else {
    console.log("there is no wallet");
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post(
  "/removeBonusCard/:username",
  async (req: Request, res: Response) => {
    const wallet = await Wallet.findOne({ username: req.params.username });
    // console.log("=======  removeBonusCard/:username =====>", wallet);
    if (wallet) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: req.params.username },
        {
          passItemLevel: 0,
          totalPoint: req.body.total,
          balance: req.body.token,
        }
      );
      // console.log("--------------removeBonusCard----------", updated_wallet);/
      const return_wallet = await Wallet.findOne({
        username: req.params.username,
      });
      return res.status(200).json(return_wallet);
    } else {
      console.log("there is no wallet");
      return res.status(400).json({ msg: "You have no permission" });
    }
  }
);

router.post("/getDailyEarn/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("=======  getDailyEarn =====>");
  const DAY = 86400 * 1000;
  const TESTMINUTE = 20 * 1000; // 10s
  if (wallet && Date.now() - wallet.dailyEarnTime > DAY) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      {
        totalPoint: wallet.totalPoint + 1000,
        balance: wallet.balance + 1000,
        dailyEarnTime: Date.now() - (Date.now() % DAY),
      }
    );
    console.log(
      "--------------getDailyEarn----------",
      updated_wallet.dailyEarnTime
    );
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });
    return res.status(200).json(return_wallet);
  } else {
    console.log("there is no wallet");
    return res.status(204).json({ msg: "You have no permission" });
  }
});

router.post("/updateLimit/:username", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ username: req.params.username });
  console.log("updateLimit =>", req.body);
  if (wallet) {
    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: req.params.username },
      { limit: req.body.limit }
    );
    //   console.log("--------------test----------",updated_wallet);
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });
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
    const return_wallet = await Wallet.findOne({
      username: req.params.username,
    });
    return res.status(200).json(return_wallet);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  console.log("-------------- all ----------");
  // const users = await Wallet.find().limit(8).sort({ totalPoint: -1 });
  const users = await Wallet.find().sort({ totalPoint: -1 });
  console.log(Date.now(), users.length);
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

router.post("/test", (req: Request, res: Response) => {
  res.send("wallet router is working...");
});
export default router;
