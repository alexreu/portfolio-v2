import { failure, success, type Result } from "./result";

/** What a guest types at the gallery's door when nothing identifies them. */
export type TypedName = { readonly firstName: string; readonly lastName: string };

export type PhotoAuthor = {
    /** Known when the guest is recognised (personal link). */
    readonly householdName: string | null;
    readonly typedName: TypedName;
};

export type SignatureError = "first-name-required" | "last-name-required";

export const MIN_FIRST_NAME_LENGTH = 2;

const tidy = (text: string) => text.trim().replace(/\s+/g, " ");

const fromTypedName = ({
    firstName,
    lastName,
}: TypedName): Result<string, readonly SignatureError[]> => {
    const first = tidy(firstName);
    const last = tidy(lastName);
    const errors: readonly SignatureError[] = [
        ...(first.length < MIN_FIRST_NAME_LENGTH ? (["first-name-required"] as const) : []),
        ...(last.length === 0 ? (["last-name-required"] as const) : []),
    ];
    return errors.length > 0 ? failure(errors) : success(`${first} ${last}`);
};

/** Every photo is signed: by the household when known, otherwise by a typed full name. */
export const signPhoto = (author: PhotoAuthor): Result<string, readonly SignatureError[]> =>
    author.householdName ? success(author.householdName) : fromTypedName(author.typedName);
