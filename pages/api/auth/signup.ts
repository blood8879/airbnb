import { NextApiRequest, NextApiResponse } from "next";
import Data from "../../../lib/data";
import bcrypt from "bcryptjs";
import { StoredUserType } from "../../../types/user";
import jwt from "jsonwebtoken";
import { isEmpty } from "lodash";
import { SignUpAPIBody } from "../../../types/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const {
            body,
        }: {
            body: SignUpAPIBody;
        } = req;
        const { email, firstname, lastname, password, birthday } = body;
        if (!email || !firstname || !lastname || !password || !birthday) {
            res.statusCode = 400;
            return res.send("필수 데이터가 없습니다.");
        }

        

        const users = Data.user.getList();
        const hashedPassword = bcrypt.hashSync(password, 8);
        let newUser: StoredUserType;
        if(isEmpty(users)) {
            newUser = {
                ...req.body,
                id: 1,
                password: hashedPassword,
                profileImage: "/static/image/default_user_profile_image.jpg"
            };
            Data.user.write([...users, newUser]);
        } else {
            const userExists = await Data.user.exist({ email });

            if(userExists) {
                res.statusCode = 409;
                // return res.send("이미 가입한 이메일입니다.");
            }
            
            const newTodoId = users.length === 0 ? 1 : users[users.length - 1].id + 1;

            newUser = {
                ...req.body,
                id: newTodoId,
                password: hashedPassword,
                profileImage: "/static/image/default_user_profile_image.jpg"
            };
            users.push(newUser);
            Data.user.write(users);
        }

        const token = jwt.sign(String(newUser.id), process.env.JWT_SECRET!);
        res.setHeader(
            "Set-Cookie",
            `access_token=${token}; path=/; expires=${new Date(
                Date.now() + 60 * 60 * 24 * 1000 * 3 //3일
            ).toUTCString}; httponly`
        );

        const newUserWithoutPassword: Partial<Pick<
            StoredUserType,
            "password"
        >> = newUser;

        delete newUserWithoutPassword.password;
        res.statusCode = 200;
        return res.send(newUser);
    }
    res.statusCode = 405;

    return res.end();
};