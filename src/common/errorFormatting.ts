import { AxiosError } from "axios";
import { CONSTANTS } from "./constants";

export const getErrorResponse = (error: AxiosError | any) => {
    let response;

   if (error.isAxiosError) {
        const { statusText: message, status, data = null } = error.response || {};
        const { name, code, errors, ...restData } = data;
        response = {
            statusCode: status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
                status,
                message,
                stack: {
                    cause: errors || restData
                }
            }),
        };
    } else {
        response = {
            statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
                status: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
                message: error.message || CONSTANTS.INTERNAL_SERVER_ERROR,
                stack: {
                    cause: error.cause || error.stack || null,
                }
            }),
        };
    }

    return response;
}