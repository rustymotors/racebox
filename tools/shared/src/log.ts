import * as P from "pino";
import { getServerConfiguration } from "./Configuration.js";

const DEFAULT_LOG_LEVEL = "trace";

export type TServerLoggerLevels =
    | "fatal"
    | "error"
    | "warn"
    | "info"
    | "debug"
    | "trace"
    | "silent";

type TServerLoggerOptions = {
    level: TServerLoggerLevels;
    name?: string;
};

/**
 * @static
 * @property {ServerLogger} instance
 */
export class TServerLogger {
    logger: P.Logger;
    static instance: TServerLogger;
    /**
     * Creates an instance of TServerLogger.
     * @param {ServerLoggerOptions} options
     */
    constructor(options?: TServerLoggerOptions) {
        const name = options?.name || "server";
        const level = DEFAULT_LOG_LEVEL;
        this.logger = P.pino({
            name,
            level,
            transport: {
                targets: [
                    {
                        target: "pino-pretty",
                        options: {
                            colorize: true,
                            ignore: "pid,hostname",
                        },
                        level: "trace",
                    },
                    {
                        target: "pino/file",
                        options: {
                            destination: "server.log",
                            append: false,
                        },
                        level: "trace",
                    },
                ],
            },
        });
        TServerLogger.instance = this;
    }

    /**
     * @param {string} message
     */
    fatal(message: string) {
        this.logger.error(message);
    }

    /**
     * @param {string} message
     */
    error(message: string) {
        this.logger.error(message);
    }

    /**
     * @param {string} message
     */
    warn(message: string) {
        this.logger.error(message);
    }

    /**
     * @param {string} message
     */
    info(message: string) {
        this.logger.info(message);
    }

    /**
     * @param {string} message
     */
    debug(message: string) {
        this.logger.debug(message);
    }

    /**
     * @param {string} message
     */
    trace(message: string) {
        this.logger.trace(message);
    }
}

/**
 * Get a logger instance
 *
 * @param {ServerLoggerOptions} options
 * @return {ServerLogger}
 */
export function getServerLogger(options?: TServerLoggerOptions): TServerLogger {
    if (typeof TServerLogger.instance === "undefined") {
        TServerLogger.instance = new TServerLogger(options);
    }

    const child = TServerLogger.instance;
    return child;
}

export const log = getServerLogger();
