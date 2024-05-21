// This is a private route

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    // console.log(files)
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    console.log(formData.imageUrls.length);
    const [imageUploadError, setImageUploadError] = useState(false);
    // for loading
    const [uploading, setUploading] = useState(false);
    const handleImageSumbit = (e) => {
        // e.preventDefault();  bcz we aint in the form
        if(files.length > 0 && files.length  < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = []; // we'll have more than one asynchronous behaious because we have many files submitting

            for (let i=0 ; i<files.length ; i++){
                promises.push(storeImage(files[i])); // our downloaded urls will be stored in this promise
            }
            // we wait for the promises to come to the promise as we store the urls
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)}); // we keep them in the form by adding new ones to the existing
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed');
                setUploading(false); 
            });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);

        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve,reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    } 
  return (
    // Main makes it seo friendly
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
            {/* Two columns in big screens but one in small screens */}
        <form className='flex flex-col sm:flex-row gap-4 '>
            {/* flex-1 sets the width of the inputs */}
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='62' required />
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className="flex gap-6 flex-wrap">
                <div className='flex gap-2'>
                    <input type="checkbox" id="sale" className='w-5'/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="rent" className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="parking" className='w-5'/>
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="furnished" className='w-5'/>
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="offer" className='w-5'/>
                    <span>Offer</span>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="bedrooms" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg"/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="bathrooms" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg"/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="regularPrice" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg"/>
                        <div>
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="discountPrice" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg"/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Prince</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className="font-semibold">
                    Images:
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max:6)</span>
                </p>
                <div className='flex gap-4'>
                    <input type='file' id='images' accept="image/*" multiple className='p-3 border border-gray-300 rounded w-full' onChange={(e) => setFiles(e.target.files)} />
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' onClick={handleImageSumbit}  disabled={uploading} >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                        <div className='flex justify-between p-3 border items-center' key={url}> 
                            <img src={url} alt='listing image' className='w-40 h-40 object-contain rounded-lg'/>
                            {/* the function below should be a call back function else it will always be calling itself even without clicking */}
                            <button type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95' onClick={() => {handleRemoveImage(index)}}>Delete</button>
                             </div>
                        
                    ))
                }
                
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>


                
            </div>
        </form>
    </main>
  )
}
