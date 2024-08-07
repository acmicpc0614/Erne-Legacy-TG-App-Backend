// import multer from "multer";
// import { findConfigurationByIp } from "../models/Surveillance";

import Wallet from "../models/Wallet";
import { LevelData, PointLimits } from "./levelData";

// const fs = require("fs");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)
//       ? req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
//         ? req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
//         : "localhost"
//       : "localhost";
//     const date = new Date();
//     const dir = path.join(
//       __dirname +
//         "/../public/screens/" +
//         ip +
//         "/" +
//         date.getFullYear() +
//         "/" +
//         (date.getMonth() + 1) +
//         "/" +
//         date.getDate()
//     );

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     const partPath =
//       "screens/" +
//       ip +
//       "/" +
//       date.getFullYear() +
//       "/" +
//       (date.getMonth() + 1) +
//       "/" +
//       date.getDate();

//     req.body = { ...req.body, fileName: partPath };

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".").pop();
//     const date = new Date();
//     const fn = `${
//       date.getHours() +
//       "." +
//       date.getMinutes() +
//       "." +
//       date.getSeconds() +
//       "." +
//       date.getMilliseconds()
//     }.${ext}`;
//     cb(null, fn);
//     req.body = { ...req.body, fileName: req.body.fileName + "/" + fn };
//   },
// });

// export const upload = multer({ storage });

function lowerBound(arr: any[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].totalPoint >= target) {
      return arr[i].level;
    }
  }
  return arr.length;
}

export const updateLevel = async (username: string, totalPoint: number) => {
  const index: number = lowerBound(LevelData, totalPoint);

  await Wallet.findOneAndUpdate({
    username: username,
    totalPoint: totalPoint,
    level: LevelData[index - 1].level,
  });
};
