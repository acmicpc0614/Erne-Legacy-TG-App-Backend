import express, { Router, Request, Response } from "express";
import Wallet from "../../models/Wallet";
import Friend from "../../models/Friend";
import {
  getBounsFromPassItem,
  isExistUser,
  lowerBound,
  updateLevel,
} from "../../utils/helper";
import { LevelData, PassItemCount } from "../../utils/levelData";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  const { username } = req.body;
  // console.log("=======  add =====>", username);

  const isExist = await Wallet.findOne({ username: username });
  if (isExist) {
    try {
      // console.log("in add req, user already exist", username);
      const user = await Wallet.findOne({ username: username });
      res.json(user);
    } catch (error) {
      console.log("error while saving user", error);
    }
  } else {
    const isFriend = await Friend.findOne({ friend: username });
    let newUser;

    if (isFriend) {
      newUser = new Wallet({
        username: username,
        totalPoint: 1000,
        balance: 1000,
      });
    } else {
      newUser = new Wallet({
        username: username,
      });
    }
    // console.log("new user saved as", username);
    await newUser.save();
    res.json(newUser);
  }
});

router.post("/update/:username", async (req: Request, res: Response) => {
  console.log("=======  update/:username =====>", req.params.username);
  const { totalPoint, balance, energy } = req.body;
  const username = req.params.username;
  const isExist = await Wallet.findOne({ username: username });
  if (isExist) {
    const index: number = lowerBound(LevelData, totalPoint);

    const updated_wallet = await Wallet.findOneAndUpdate(
      { username: username },
      {
        totalPoint: totalPoint,
        balance: balance,
        energy: energy,
        level: LevelData[index - 1].level,
      }
    );
    res.status(200).json(updated_wallet);
    // console.log("update user updated_wallet =>", updated_wallet.level);
  } else {
    // console.log("in update req, user does not exist", username);
    res.status(400).json({ msg: "User does not exist" });
  }
});

router.post("/updateEnergy/:username", async (req: Request, res: Response) => {
  console.log("=======  updateEnergy/:username =====>");
  const { energy } = req.body;
  const username = req.params.username;
  try {
    const isExist = await Wallet.findOne({ username: username });
    if (isExist) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: username },
        { energy: energy }
      );
      console.log("update user updated_wallet =>", updated_wallet.username);
      res.status(200).json(updated_wallet);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
router.post("/updateTap/:username", async (req: Request, res: Response) => {
  console.log("========= updateTap ======>");

  const { tap } = req.body;
  const username = req.params.username;
  try {
    const isExist = await Wallet.findOne({ username: username });
    if (isExist) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: username },
        { tap: tap }
      );
      console.log("update user updated_wallet =>", updated_wallet.username);
      res.status(200).json(updated_wallet);
    } else {
      console.log("in updateTap, user does not exist");
    }
  } catch (error) {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/buyBonusCard/:username", async (req: Request, res: Response) => {
  console.log("====== buyBonusCard =========>");
  const { passItemLevel, token } = req.body;
  const username = req.params.username;
  try {
    const isExist = await Wallet.findOne({ username: username });
    if (isExist) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: username },
        {
          passItemLevel: passItemLevel,
          passItemStartTime: Date.now(),
          balance: token,
        }
      );
      console.log("update user updated_wallet =>", updated_wallet.username);
      res.json(updated_wallet);
    } else {
      console.log("in buyBonusCard, user does not exist");
    }
  } catch (error) {
    console.log("in buyBonusCard, catch error", error);
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post(
  "/removeBonusCard/:username",
  async (req: Request, res: Response) => {
    console.log("=======  removeBonusCard/:username =====>");
    const { totalPoint, token } = req.body;
    const username = req.params.username;
    try {
      const isExist = await Wallet.findOne({ username: username });
      if (isExist) {
        const updated_wallet = await Wallet.findOneAndUpdate(
          { username: username },
          {
            passItemLevel: 0,
            totalPoint: totalPoint,
            balance: token,
          }
        );
        console.log(
          "remove card user updated_wallet =>",
          updated_wallet.username
        );
        res.status(200).json(updated_wallet);
      } else {
        console.log("in removeBonusCard, user does not exist");
      }
    } catch (error) {
      console.log("in removeBonusCard, catch error", error);
      return res.status(400).json({ msg: "You have no permission" });
    }
  }
);

router.post("/getDailyEarn/:username", async (req: Request, res: Response) => {
  console.log("=======  getDailyEarn =====>");
  const { username } = req.params;

  const AMOUTDAY = 1000;
  const DAY = 20 * 1000;
  // const DAY = 86400 * 1000;

  try {
    const isExist = await Wallet.findOne({ username: username });
    if (isExist) {
      const wallet = await Wallet.findOne({ username: username });
      if (Date.now() - wallet.dailyEarnTime > DAY) {
        const updated_wallet = await Wallet.findOneAndUpdate(
          { username: username },
          {
            totalPoint: wallet.totalPoint + AMOUTDAY,
            balance: wallet.balance + AMOUTDAY,
            dailyEarnTime: Date.now(),
          }
        );
        const return_wallet = await Wallet.findOne({
          username: username,
        });
        console.log("in getDailyEarn", return_wallet.balance);
        return res.status(200).json(return_wallet);
      } else {
        console.log("You early get daily earn.");
        return res.status(204).json({ msg: "You early get daily earn." });
      }
    }
  } catch (error) {
    console.log("in getDailyEarn, catch error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/updateLimit/:username", async (req: Request, res: Response) => {
  console.log("updateLimit =>", req.body);
});

router.post("/updateBalance/:username", async (req: Request, res: Response) => {
  console.log("updateBalance =>");
  const { balance } = req.body;
  const username = req.params.username;
  try {
    const isExist = await Wallet.findOne({ username: username });
    if (isExist) {
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: username },
        { balance: balance }
      );
      console.log("updateBalance updated_wallet =>", updated_wallet.username);
      res.status(200).json(updated_wallet);
    } else {
      console.log("in updateBalance, user does not exist");
    }
  } catch (error) {
    console.log("in updateBalance, catch error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  console.log("-------------- all ----------");

  const users = await Wallet.find().sort({ totalPoint: -1 });

  res.json(users);
});

router.post("/:username", async (req: Request, res: Response) => {
  let user = await Wallet.findOne({ username: req.params.username });
  if (user) {
    console.log("user =>", user.balance);
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
