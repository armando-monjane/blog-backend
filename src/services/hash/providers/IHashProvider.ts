/**
 * Interface for a hash provider that can hash and compare data.
 */
export interface IHashProvider {
    /**
     * Hashes the given data with the provided salt or number of rounds.
     * @param data - The data to be hashed.
     * @param saltOrRounds - The salt or number of rounds to use for hashing.
     * @returns Promise<string> that resolves to the hashed data.
     */
    make(data: string, saltOrRounds: string | number): Promise<string>;

    /**
     * Compares the given data with the provided encrypted data.
     * @param data - The data to be compared.
     * @param encrypted - The encrypted data to compare against.
     * @returns {Promise<boolean>} that resolves to a boolean indicating whether the data matches the encrypted data.
     */
    compare(data: string, encrypted: string): Promise<boolean>;
}