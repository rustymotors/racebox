import { TConfiguration } from "rm-shared";
/**
 * Read the TLS certificate file
 * @param {TConfiguration} config
 * @return {string}
 */
export declare function handleGetCert(config: TConfiguration): Promise<string>;
/**
 * Generate Windows registry configuration file for clients
 * @param {TConfiguration} config
 * @return {string}
 */
export declare function handleGetRegistry(config: TConfiguration): string;
/**
 *  Read TLS public key file to string
 * @param {TConfiguration} config
 * @return {string}
 */
export declare function handleGetKey(config: TConfiguration): Promise<string>;
