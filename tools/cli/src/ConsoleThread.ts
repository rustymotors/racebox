import { emitKeypressEvents } from "node:readline";
import { IGatewayServer, SubThread, type TServerLogger } from "rm-shared";
import { KeypressEvent } from "./types.js";

/**
 * @module ConsoleThread
 */

/**
 * Console thread
 */
export class ConsoleThread extends SubThread {
    parentThread: IGatewayServer;
    /**
     * @param {object} options
     * @param {Gateway} options.parentThread The parent thread
     * @param {ServerLogger} options.log The logger
     */
    constructor({
        parentThread,
        log,
    }: {
        parentThread: IGatewayServer;
        log: TServerLogger;
    }) {
        super("ReadInput", log, 100);
        if (parentThread === undefined) {
            throw new Error(
                "parentThread is undefined when creating ReadInput",
            );
        }
        this.parentThread = parentThread;
    }

    /** @param {KeypressEvent} key */
    handleKeypressEvent(key: KeypressEvent) {
        const keyString = key.sequence;

        if (keyString === "x") {
            this.emit("userExit");
        }

        if (keyString === "r") {
            this.emit("userRestart");
        }

        if (keyString === "?") {
            this.emit("userHelp");
        }
    }

    override init() {
        super.init();
        emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        this.log.info("GatewayServer started");
        this.log.info("Press x to quit");

        process.stdin.resume();
        process.stdin.on("keypress", (str, key) => {
            if (key !== undefined) {
                this.handleKeypressEvent(key);
            }
        });
    }

    override run() {
        // Intentionally left blank
    }

    stop() {
        // Remove all listeners from stdin, preventing further input
        process.stdin.removeAllListeners("keypress");
        process.stdin.pause();
        super.shutdown();
    }
}
