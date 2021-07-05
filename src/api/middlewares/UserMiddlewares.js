import bcrypt from 'bcrypt';

class UserMiddlewares {
    
    async passwordIsAvailable(req, res, next) {
        if (!req.body.password)
            return res.status(400).json({ error: true, message: "Password not provided." });
        return next();
    }

    async confirmPassword(req, res, next) {
        if (req.body.password !== req.body.confirmation_password)
            return res.status(400).json({ error: true, message: "Password does not match." })
        return next();
    }

    async userExist(req, res, next) {
        const userExist = await UserModel.findOne({ email: req.body.email });
        if (!userExist)
            return res.status(404).json({ error: true, message: "User not found!" });
        return next();
    }
}

export default new UserMiddlewares();