import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

// general interface  for all react-hook-forms
interface TextInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    // pass any array of properties to TextInputFieldProps 
    [x: string]: any,
}

const TextInputField = ({name, label, register, registerOptions, error, ...props} : TextInputFieldProps) => {
    return (
        <FormGroup className="mb-3" controlId={name + "-input"}>
            <FormLabel>{label}</FormLabel>
            <FormControl 
                {...props}
                {...register(name, registerOptions)}            
                isInvalid={!!error}    
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </FormGroup>
    );
}

export default TextInputField;