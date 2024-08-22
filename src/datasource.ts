import { DataSource } from "typeorm";
import "dotenv/config";
import { User } from "./entities/User";
import { Role } from "./entities/Role";

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: 1433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Role],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    synchronize: true,
    logging: true,
});
