import { createLogger, format, transports } from "winston";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()}${message}`;
});

export const logger = createLogger({
    level: "info",
    format: combine(timestamp(), colorize(), logFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
        new transports.File({ filename: path.join(logDirectory, "combined.log") }),
    ],
});

export const httpLogger = morgan("combined", {
    stream: fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" }),
});