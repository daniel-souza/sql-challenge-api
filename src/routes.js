import { Router } from "express";
import { sqlitedb } from "./api/database/Connection.js";

const routes = new Router();

routes.get("/", async (req, res) => res.json({ error: false, message: "Hello World!" }));

routes.get("/api/query", async (req, res, next) => {
    try {
        if(!req.body.query) {
            error = new Error("no query provided!");
            error.status(400)
            return next(error);
        }

        sqlitedb.all(req.body.query, (error, rows) => {
            if (error)
                return res.status(400).json({error: true, message: error.message})
            return res.json({ error: false, rows })
        });
    } catch (err) {
        return next(err)
    }

});

routes.use(async (req, res, next) =>
    res.status(404).json({ error: true, message: `Resource ${req.resource} not found!` })
);

routes.use(async (err, req, res, next) => {
    console.log(err)
    return (err.status)
        ? res.status(err.status).json({ error: true, message: err.message })
        : res.status(500).json({ error: true, message: "Internal server error!" })
});

export default routes;