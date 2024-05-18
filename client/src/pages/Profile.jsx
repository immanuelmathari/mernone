import  { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { app } from "../firebase.js";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {updateUserStart,updateUserSuccess,updateUserFailure} from "../redux/userSlice"
import { useDispatch } from "react-redux";

export default function Profile()
{
    const {currentUser} = useSelector((state) => state.user)
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    // console.log(formData);
    // console.log(filePerc);
    // console.log(fileUploadError);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => { getDownloadURL(uploadTask.snapshot.ref).then
                ((downloadURL) => 
                    setFormData({...formData, avatar:downloadURL})
            );
        }
    );
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id] : e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(updateUserStart());
            // const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage

            // Update formData before making the request
        const updatedFormData = {
            ...formData,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

            const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    // 'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                body: JSON.stringify(updatedFormData),
                // credentials: 'include',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
        }catch (error) 
        {
            dispatch(updateUserFailure(error.message));
        }
    }

    
    return(
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
                <img src={currentUser.avatar  ||  formData.avatar} alt="avatar" onClick={() => fileRef.current.click()}  className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
                <p className="text-sm self-center">
                    {fileUploadError ? 
                    <span className="text-red-700">Image Upload Error</span>    
                    : filePerc > 0 && filePerc < 100 ? 
                    <span className="text-slate-700">'Uploading ${filePerc}'</span>
                    : filePerc === 100 ? 
                    <span className="text-green-700">Image Upload Successfully</span>    
                    : ( " ") 
                }
                </p>
                <input type="text" placeholder="UserName" defaultValue={currentUser.username} onChange={handleChange} className="border p-3 rounded-lg mt-4" id="username"/>
                <input type="text" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} className="border p-3 rounded-lg mt-4" id="email"/>
                <input type="password" placeholder="password" onChange={handleChange} className="border p-3 rounded-lg mt-4" id="password"/>
                <input type="submit" value="submit" className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80" />
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer">Delete Account</span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
        </div>
    )
}