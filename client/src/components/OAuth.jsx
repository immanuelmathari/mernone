import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup  } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { signinSuccess, signinStart, signinFailure } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase.js'


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth,provider);
            const res = await fetch('http://localhost:3000/api/auth/google',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    name : result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            })
            const data = await res.json();
            console.log(data);
            dispatch(signinSuccess);
            navigate('/');
        }catch(error)
        {
            console.log("Could not sign in with google", error);
        }
    }
  return (
    <button className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95' type="button" onClick={handleGoogleClick}>
        Continue With Google
    </button>
  )
}
