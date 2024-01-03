import { post } from "shared/api";
import { appConfig } from "config";
import { Passwords } from "types";

export function resetPassword(
    passwords: Passwords,
    onSuccess?: (passwords: Passwords) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return post<Passwords>(
        `${appConfig.apiUrl}reset_password`,
        appConfig.apiTimeoutSeconds,
        passwords,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}