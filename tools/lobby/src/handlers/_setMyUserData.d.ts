import { TServerLogger, LegacyMessage } from "rm-shared";
export declare function _setMyUserData({
    connectionId,
    message,
    log,
}: {
    connectionId: string;
    message: LegacyMessage;
    log: TServerLogger;
}): Promise<{
    connectionId: string;
    message: LegacyMessage;
}>;
