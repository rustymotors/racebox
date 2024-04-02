import { TServerLogger, SerializedBuffer } from "../../shared";
export declare function handleTrackingPing({
    connectionId,
    message,
    log,
}: {
    connectionId: string;
    message: SerializedBuffer;
    log: TServerLogger;
}): Promise<{
    connectionId: string;
    messages: SerializedBuffer[];
}>;
