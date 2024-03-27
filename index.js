import express from "express";
import mongoose from "mongoose";
import { postSchema } from "./models/postSchema.js";

async function connectDb() {
    let connection = await mongoose
        .createConnection("mongodb://localhost:27017/new")
        .asPromise();
    return connection;
}

const connection = await connectDb();

const app = express();

function switchDb(dbName) {
    return async function changeDb(req, res, next) {
        try {
            console.time("key");

            const dbConnection = connection.useDb(dbName, {
                useCache: true,
            });

            console.timeEnd("key");

            req.dbConnection = dbConnection;
            next();
        } catch (error) {
            console.log(error);
        }
    };
}

app.get("/new", switchDb("new"), async (req, res) => {
    const { dbConnection } = req;
    const data = await dbConnection.model("post", postSchema).find({});
    res.status(200).json(data);
});

app.get("/new2", switchDb("new2"), async (req, res) => {
    const { dbConnection } = req;
    const data = await dbConnection.model("post", postSchema).find({});
    res.status(200).json(data);
});

app.get("/", async (req, res) => {
    const data = await connection.model("post", postSchema).find({});
    res.status(200).json(data);
});

app.listen(4000, () => {
    console.log("server started");
});
