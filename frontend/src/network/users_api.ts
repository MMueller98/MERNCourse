import { User } from "../models/user";
import fetchData from "../utils/fetchWrapper";

// =========================================================================================================
// INTERFACES
// =========================================================================================================
export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export interface LoginCredentials {
    username: string,
    password: string,
}

// =========================================================================================================
// API FUNCTIONS
// =========================================================================================================
// return user that is logged in
export async function getLoggedInUser(): Promise<User> {
    // return user data of logged in user
    //  -> if you are on different domain you have to include credentials
    //  -> on local host cookies are sent automatically
    const response = await fetchData("/api/users", {method: "GET"});
    return response.json();
}


// create new user account and return response
export async function signUp(credentials:SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
}

// login existing user and return response
export async function login(credentials:LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
}

// log user out
export async function logout() {
    await fetchData("/api/users/logout", {method:"POST"});
}