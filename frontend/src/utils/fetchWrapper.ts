import { ConflictError, UnauthorizedError } from "../errors/HttpErrors";

// wrapper function for fetch
export default async function fetchData(input:RequestInfo, init?:RequestInit) {
    const response = await fetch(input, init);
    // response.ok will return true if response status is between 200 and 300
    if(response.ok){
        return response;
    }else{
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if(response.status === 401){
            throw new UnauthorizedError(errorMessage);
        }else if(response.status === 409){
            throw new ConflictError(errorMessage)
        }
        throw Error(`Request failed with status ${response.status}. Error message: ${errorMessage}`);
    }
}