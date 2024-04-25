import React from "react"
import { Link , useNavigate } from 'react-router-dom'
import { useState } from 'react'


export default function Signin()
{
    const [formData, setFormData] = useState({});
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id] : e.target.value,
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch('http://localhost:3000/api/auth/signin',
        {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
            },
            body : JSON.stringify(formData),
            credentials: 'include', 
        });
        const data = await res.json();
        console.log(data);
        if(data.success === false)
        {
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/');
        }
        catch (error)
        {
            setLoading(false);
            setError(error.message);
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
           <h1 className='text-3xl text-center font-semibold my-7'>
            SignIn
           </h1>
           <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input type='email' onChange={handleChange} placeholder='Email' id='email' className='p-3 border rounded-lg' />
            <input type='password'  onChange={handleChange} placeholder='Password' id='password' className='p-3 border rounded-lg' />
            <button  disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "loading" : "Sign in"}</button>
           </form>
           <div className='flex gap-3 mt-5'>
            <p>Do not Have an account?</p>
            <Link to='/signup'>
              <span className='text-blue-700'>Sign Up</span>
            </Link>
           </div>
           {error && <p className='text-red-500 mt-5'>{error}</p> }
        </div>
      )
}