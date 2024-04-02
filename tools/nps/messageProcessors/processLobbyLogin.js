import { getDWord, getLenString } from "../utils/pureGet.js";
import { getUserSessionByProfileId, setUserSession, userSessions, } from "../services/session.js";
import { GameMessage } from "../messageStructs/GameMessage.js";
import { UserInfo } from "../messageStructs/UserInfo.js";
import { getServerLogger } from "rm-shared";
const log = getServerLogger();
export async function processLobbyLogin(connectionId, message, socketCallback) {
    // This message is a BareMessageV0
    const profileId = getDWord(message.getDataAsBuffer(), 0, false);
    const profileName = getLenString(message.getDataAsBuffer(), 4, false);
    const session = await getUserSessionByProfileId(profileId);
    // Dump all sessions
    console.dir(userSessions);
    // If the session doesn't exist, return
    if (!session) {
        log.error(`Session not found for profile ID ${profileId}`);
        throw new Error(`Session not found for profile ID ${profileId}`);
    }
    // Create the new session
    const newSession = {
        ...session,
        connectionId,
    };
    // Set the new session
    setUserSession(newSession);
    log.info(`LobbyLogin: ${message.toString()}`);
    const response = new UserInfo(profileId, profileName);
    log.info(`Sending response: ${response.toString()}`);
    const responseMessage = new GameMessage(0);
    responseMessage.header.setId(0x120);
    responseMessage.setData(response);
    log.info(`Response message: ${responseMessage.toString()}`);
    const responseBytes = responseMessage.serialize();
    socketCallback([responseBytes]);
}
