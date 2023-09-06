import { Book } from "src/models/book.model";
import { Message } from "src/models/message.model";
import { Settings } from "src/models/settings.model";
import { Website } from "src/models/website.model";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456789",
    database: "slotabimbot",
    synchronize: true,
    logging: true,
    entities: [Website, Message, Settings, Book],
    subscribers: [],
    migrations: [],
})