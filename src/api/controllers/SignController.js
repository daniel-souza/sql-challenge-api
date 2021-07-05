import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import utils from '../utils/Mailer.js';

import UserModel from '../models/UserModel.js';

UserModel

class SignController {
    async signup(req, res, next) {
        try {
            const user = new UserModel(req.body);
            await user.save();
            const { _id, name, email } = user;
            const token = jwt.sign({ id: _id, name, email }, process.env.API_SIGNUP_SECRET, { expiresIn: "1h" })
            const result = await utils.sendMail(user, token);
            if (result.success)
                return res.json({
                    error: false,
                    message: `Congratulations ${user.name}, `
                        + `you are one step of registering. `
                        + `A confirmation link were sent to your email ${user.email} `
                        + `to conclude with the registration.`
                })
            return next(result.fail)
        } catch (err) {
            return next(err)
        }
    }

    async activate(req, res, next) {
        try {
            if (!req.query.token) throw new Error();
            const payload = jwt.verify(req.query.token, process.env.API_SIGNUP_SECRET);
            payload.iat = undefined;
            payload.exp = undefined;
            await UserModel.findOneAndUpdate({ _id: payload.id }, { expireAt: null });

            return res.json({ error: false, user: payload, message: "User activated sucessfully!" });
        } catch (err) {
            console.log(err)
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: true,
                    message: "The account validation token has expired!"
                });
            }

            return res.status(404).json({
                error: true,
                message: "Resource not found"
            })
        }
    }

    async login(req, res, next) {
        if (!req.body.password || !req.body.email)
            return res.status(400).json({ error: true, message: "User or password not provided!" });

        const userExists = await UserModel.findOne({ email: req.body.email }).select("+password");
        if (!userExists)
            return res.status(400).json({ error: true, message: "User not found!" });
        console.log(userExists)
        if (userExists.expireAt)
            return res.status(400).json({ error: true, message: "User not activated! Please, check your inbox for activating your account." });
        if (!bcrypt.compareSync(req.body.password, userExists.password))
            return res.status(400).json({ error: true, message: "User or password not valid!" });

        return res.json({
            error: false,
            user: { name: userExists.name },
            token: jwt.sign({ id: userExists._id, role: userExists.role }, process.env.API_LOGIN_SECRET, { expiresIn: "1d" })
        });
    }
}

export default new SignController();