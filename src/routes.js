import { Router } from "express";

import { sqlitedb } from "./api/database/Connection.js";

import UserModel, { AdminModel } from "./api/models/UserModel.js";

import UserMiddlewares from "./api/middlewares/UserMiddlewares.js";
import authorize from "./api/middlewares/AuthMiddleware.js";

import SignController from "./api/controllers/SignController.js";
import ProfileController from "./api/controllers/ProfileController.js";

const routes = new Router();

routes.get("/", async (req, res) => res.json({ error: false, message: "Hello World!" }));

routes.get("/api/query", authorize(), async (req, res, next) => {
    try {
        if (!req.body.query) {
            const error = new Error("no query provided!");
            error.status(400)
            return next(error);
        }

        sqlitedb.all(req.body.query, (error, rows) => {
            if (error)
                return res.status(400).json({ error: true, message: error.message })
            return res.json({ error: false, rows })
        });
    } catch (err) {
        return next(err)
    }

});

routes.post('/signup', UserMiddlewares.confirmPassword, SignController.signup);
routes.get('/signup/activation', SignController.activate);
routes.post('/login', SignController.login);

routes.get('/profile', authorize(), ProfileController.show);

routes.get("/users", async (req, res, next) => {
    try {
        const users = await UserModel.find().select("-password");
        return res.json({error: false, users});
    } catch (err) {
        return next(err)
    }
});

routes.delete("/users", async (req, res, next) => {
    try {
        const users = await UserModel.deleteMany({});
        return res.json({error: false, users});
    } catch (err) {
        return next(err)
    }
});

routes.use(async (req, res, next) =>
    res.status(404).json({ error: true, message: `Resource ${req.url} not found!` })
);

routes.use(async (err, req, res, next) => {
    console.log(err)
    if (err.name === "ValidationError")
        return res.status(400).json({
            error: true,
            message: err.message,
            ValidationError: err.errors
        });
    if(err.code === 11000)
        return res.status(400).json({
            error: true,
            message: `This value already exists!`,
            duplicated: err.keyValue
        });
    return (err.status)
        ? res.status(err.status).json({ error: true, message: err.message })
        : res.status(500).json({ error: true, message: "Internal server error!" })
});

export default routes;