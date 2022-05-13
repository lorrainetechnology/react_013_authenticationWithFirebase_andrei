import { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import './sign-up-form.styles.scss';

const defaultFormFields = {
    displayname: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const SignUpForm = () => {
    const [formFields, setFormFields ] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword} = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);
            await createUserDocumentFromAuth(user, { displayName });
            resetFormFields();
        } catch(error) {
            if(error.code === 'auth/email-already-in-use') {
                alert("Cannot create user, email already in use");
            } else {
                console.log("user creation encountered an error ", error);
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({...formFields, [name]: value })
    };

    return (
        <div className='sign-up-container'>
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput label="Display Name" inputOptions = {{type:'text', required: true, onChange:{handleChange}, name:"displayName" ,value:{displayName}}}></FormInput>
            
                <FormInput label="Email" type='email' required onChange={handleChange} name="email" value={email}></FormInput>
                
                <FormInput label="Password" type='password' required onChange={handleChange} name="password" value={password}></FormInput>
                
                <FormInput label="ConfirmPassword" type='password' required onChange={handleChange} name="confirmPassword" value={confirmPassword}></FormInput>   

                <Button type='submit'>Sign In</Button>          
            </form>
        </div>
    )
};

export default SignUpForm;