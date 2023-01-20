import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/users_api";
import * as UsersApi from "../network/users_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import { useState } from 'react';

import styleUtils from "../styles/utils.module.css"
import { ConflictError } from "../errors/HttpErrors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user:User) => void,
}

// Modal that opens when user wants to sign up
const SignUpModal = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {

    // custom error messages 
    const [errorText, setErrorText] = useState<string | null>(null);
    
    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<SignUpCredentials>();

    // Call UsersApi signUp function when Signup-Button (submit) is clicked
    async function onSubmit(credentials:SignUpCredentials) {
        try {
            const newUser = await UsersApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            // error handling
            if(error instanceof ConflictError){
                setErrorText(error.message);
            }else{
                alert(error);
            }
            
            console.error(error);
        }
    }
    
    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                Sign Up
                </Modal.Title>
                
            </Modal.Header>

            <Modal.Body>
                {errorText && 
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField 
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error= {errors.username}
                    />
                    <TextInputField 
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error= {errors.email}
                    />
                    <TextInputField 
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error= {errors.password}
                    />
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default SignUpModal;