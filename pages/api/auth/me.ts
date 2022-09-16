import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Data from "../../../lib/data";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            const accessToken = req.headers.cookie;
            if(!accessToken) {
                res.statusCode = 400;
                return res.send("access_token이 없습니다.");
            }
            const userId = jwt.verify(accessToken, process.env.JWT_SECRET!);
            // console.log("me.ts // userID==",userId);
            const user = await Data.user.find({ id: Number(userId)});
            if(user) {
                delete user.password;
                res.statusCode = 200;
                return res.send(user);
            }
            return res.end();
        } catch(e) {
            console.log(e);
            res.statusCode = 500;
            return res.send(e);
        }
    }
    res.statusCode = 405;

    return res.end();
};