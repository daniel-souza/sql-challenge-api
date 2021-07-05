import mongoose from 'mongoose';
import sqlite3 from 'sqlite3';

const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;

class Connection {
    constructor() {
        this.mongodb();
        this.sqlitedb = this.sqlite3();
    }
    //uri: mongodb+srv://<user>:<password>@<host>/<database>
    mongodb() {
        mongoose.connect(//(DB_HOST) ? remoto : local
            (DB_HOST) ? `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
                : "mongodb://localhost/adsbackend", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).then(() => {
            console.log("Conexão com o MongoDb realizada com sucesso!");
        }).catch((exception) => {
            console.log("Erro: Conexão com MongoDB não foi realizada com sucesso" + exception);
        });
    }
    sqlite3() {
        sqlite3.verbose();
        return new sqlite3.Database('./db/tables.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
               return console.error(err.message);
            }
            console.log('Connected to the tables database.');
        });
    }
}

const connection = new Connection();

export const sqlitedb = connection.sqlitedb;

export default connection;