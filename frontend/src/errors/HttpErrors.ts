class HttpError extends Error{
    constructor(message?: string){
        super(message);
        // puts name of error (e.g. UnauthorizedError) as name pro 
        this.name = this.constructor.name;
    }
}

/**
 * Status code: 401
 */
export class UnauthorizedError extends HttpError{};

/**
 * Status code: 409
 */
export class ConflictError extends HttpError{};