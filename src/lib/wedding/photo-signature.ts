import { failure, success, type Result } from "./result";

export type PhotoAuthor = {
    /** Known when the guest is recognised (personal link, or a table search). */
    readonly householdName: string | null;
    readonly typedFirstName: string;
};

export type SignatureError = "first-name-required";

export const MIN_FIRST_NAME_LENGTH = 2;

const fromTypedName = (typed: string): Result<string, SignatureError> => {
    const firstName = typed.trim();
    return firstName.length >= MIN_FIRST_NAME_LENGTH
        ? success(firstName)
        : failure("first-name-required");
};

/** Every photo is signed: by the household when known, otherwise by a typed first name. */
export const signPhoto = (author: PhotoAuthor): Result<string, SignatureError> =>
    author.householdName ? success(author.householdName) : fromTypedName(author.typedFirstName);
