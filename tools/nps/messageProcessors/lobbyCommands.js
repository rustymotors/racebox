// 030c0004cdcdcdcd
import { getLobMiniRiffList } from "./getLobMiniRiffList.js";
import { getLobMiniUserList } from "./getLobMiniUserList.js";
export const lobbyCommandMap = new Map();
lobbyCommandMap.set(0x30c, getLobMiniRiffList);
lobbyCommandMap.set(0x128, getLobMiniUserList);
