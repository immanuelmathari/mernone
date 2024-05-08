import  { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { app } from "../firebase";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

export default function Profile()
{
    const {currentUser} = useSelector((state) => state.user)
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    console.log(formData);
    console.log(filePerc);
    console.log(fileUploadError);

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
    return(
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center">Profile</h1>
            <form action="" className="flex flex-col gap-4">
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
                <img src={formData.avatar || currentUser.avatar} alt="avatar" onClick={() => fileRef.current.click()}  className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
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
                <input type="text" placeholder="UserName" className="border p-3 rounded-lg mt-4" id="username"/>
                <input type="text" placeholder="email" className="border p-3 rounded-lg mt-4" id="email"/>
                <input type="text" placeholder="password" className="border p-3 rounded-lg mt-4" id="password"/>
                <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer">Delete Account</span>
                <span className="text-red-700 cursor-pointer">Sign Out</span>
            </div>
        </div>
    )
}