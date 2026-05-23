import React from "react";
import {Lock, Mail, User2Icon} from 'lucide-react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import api from "../configs/api";
import { login } from "../app/features/authSlice";

const Login = ()=> {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
// state for login or register
    const [state, setState] = React.useState( urlState ||"login");

    // state for input value
    const [data, setData] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    



    // handle change input value
    const onChangeHandler = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/users/${state}`, data);
            const { token, user } = response.data;

            // Store token in localStorage
            localStorage.setItem('token', token);

            // Show success toast
            toast.success(`${state === 'login' ? 'Login' : 'Registration'} successful!`);

            // Dispatch login action to Redux store
            dispatch(login({ token, user }));

            // Navigate to app page
            navigate('/app');
        } catch (error) {
            console.error('Login/Register error:', error);
            // Show error toast
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };





  return (
     <div className='flex items-center justify-center min-h-screen bg-gray-50'>

   <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">Please {state} in to continue</p>
                {state !== "login" && (
                  <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <User2Icon size={16} color="#6B7280"/>     
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={data.name} onChange={onChangeHandler} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={13} color="#6B7280"/>
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={data.email} onChange={onChangeHandler} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color="#6B7280" />
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={data.password} onChange={onChangeHandler} required />
                </div>
                <div className="mt-4 text-left text-green-500">
                    <button className="text-sm" type="reset">Forget password?</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p>
            </form>

                </div>
  )
}

export default Login