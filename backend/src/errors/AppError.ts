
export class AppError extends Error {

    constructor( public readonly codeError: string,message: string) {
    super(message);
    }
}