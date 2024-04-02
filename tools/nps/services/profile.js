import { GameProfile } from "../messageStructs/GameProfile.js";
export const gameProfiles = [];
export async function populateGameProfiles(profiles) {
    const profile1 = GameProfile.new();
    profile1.customerId = 2;
    profile1.profileName = "molly";
    profile1.serverId = 1;
    profile1.createStamp = 0;
    profile1.lastLoginStamp = 0;
    profile1.numberGames = 0;
    profile1.profileId = 1000;
    profile1.isOnline = false;
    profile1.gamePurchaseStamp = 0;
    profile1.gameSerialNumber = "";
    profile1.timeOnline = 0;
    profile1.timeInGame = 0;
    profile1.gameBlob = Buffer.alloc(0);
    profile1.personalBlob = Buffer.alloc(0);
    profile1.pictureBlob = Buffer.alloc(0);
    profile1.dnd = false;
    profile1.gameStartStamp = 0;
    profile1.currentKey = "";
    profile1.profileLevel = 0;
    profile1.shardId = 44;
    profiles.push(profile1);
}
export async function getGameProfilesForCustomerId(customerId) {
    const profiles = [];
    for (const profile of gameProfiles.values()) {
        if (profile.customerId === customerId) {
            profiles.push(profile);
        }
    }
    return profiles;
}
export async function gameProfileExists(profileName) {
    for (const profile of gameProfiles.values()) {
        if (profile.profileName === profileName) {
            return true;
        }
    }
    return false;
}
export async function addGameProfile(profile) {
    gameProfiles.push(profile);
}
export async function deleteGameProfile(profileId) {
    for (const [index, profile] of gameProfiles.entries()) {
        if (profile.profileId === profileId) {
            gameProfiles.splice(index, 1);
            return;
        }
    }
}
export async function createGameProfile() {
    const profile = GameProfile.new();
    addGameProfile(profile);
    return profile;
}
