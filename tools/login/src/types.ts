export interface UserRecordMini {
    contextId: string;
    customerId: number;
    userId: number;
}

export interface GameMessageOpCode {
    name: string;
    value: number;
    module: "Lobby" | "Login";
}
