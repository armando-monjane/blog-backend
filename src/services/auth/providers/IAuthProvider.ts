/**
 * Interface for authentication providers that can sign and generate jwt tokens.
 */
export interface IAuthProvider {
    /**
     * Signs a payload and returns a token.
     * @param payload - The payload to sign.
     * @returns The signed token.
     */
    sign(payload: object): object;
}