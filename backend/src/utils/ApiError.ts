

class ApiError extends Error {

    statusCode: number;
    data?: null
    message: string;
    success?: boolean;
    errors: any;
    stack: any;
    
    
    
        constructor(
            statusCode : number ,
            message= "",
            errors = [],
            stack = ""
        ){
            super(message)
            this.statusCode = statusCode
            this.data = null
            this.message = message
            this.success = false;
            this.errors = errors
    
            if (stack) {
                this.stack = stack
            } else{
                Error.captureStackTrace(this, this.constructor)
            }
    
        }
    }
    
    export default ApiError;