import { ErrorCodes, HttpException } from "./root";

export class NotFoundException extends HttpException {
    constructor(message:string, errorCode:ErrorCodes) {
        super(message, 404, errorCode, null);
    }
}