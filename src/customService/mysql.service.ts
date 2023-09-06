import { Book } from "src/models/book.model";
import { Message } from "src/models/message.model";
import { Settings } from "src/models/settings.model";
import { Website } from "src/models/website.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "spryrr1myu6oalwl.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    port: 3306,
    username: "k6cmh8q1hxlz3qkp",
    password: "wa5qfwy66og5b78q",
    database: "pz6nl117rkr41hgi",
    synchronize: true,
    logging: true,
    entities: [Website, Message, Settings, Book],
    subscribers: [],
    migrations: [],
})