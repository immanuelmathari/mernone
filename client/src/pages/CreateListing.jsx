// This is a private route

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {
    // for the useRef of the user. we want to know which user is creating this listing
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([]);
    // console.log(files)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false, // now we add event listener to each input
    });
    console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);
    // for loading
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

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
    
    const handleChange = (e) => {
        // setFormData({...formData, [e.target.id] : e.target.value});
        // remember we have different type of inputs
        if (e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData, type:e.target.id,
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData, [e.target.id] : e.target.checked
                // we track our 3 options
            })
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData, [e.target.id] : e.target.value,
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // if there is no image we return an error
            if (formData.imageUrls.length < 1) return setError('Upload at least one image');
            // we convert them to number by adding the +
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be less than regular price')
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    // we must also send the use ref of the person who is creating it
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            
            if(data.success === false){
                setError(error.message);
            }

            // remember if it has a variable you use a backtake/backkick
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
  return (
    // Main makes it seo friendly
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
            {/* Two columns in big screens but one in small screens */}
        <form className='flex flex-col sm:flex-row gap-4 ' onSubmit={handleSubmit}>
            {/* flex-1 sets the width of the inputs */}
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='2' required onChange={handleChange} value={formData.name}/>
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description}/>
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address}/>
                <div className="flex gap-6 flex-wrap">
                <div className='flex gap-2'>
                    {/* For this we are checking if what is checked is this one */}
                    <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={formData.type === 'sale'} /> 
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={formData.type === 'rent'}/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking}/>
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished}/>
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer}/>
                    <span>Offer</span>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="bedrooms" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg" onChange={handleChange} value={formData.bedrooms}/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="bathrooms" min='1' max='10' required  className="p-3 border border-gray-300 rounded-lg" onChange={handleChange} value={formData.bathrooms}/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='Number' id="regularPrice" min='50' max='10000000' required  className="p-3 border border-gray-300 rounded-lg" onChange={handleChange} value={formData.regularPrice}/>
                        <div>
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    {/* You only see discounted price if offer is true */}
                    {formData.offer && (
                        <div className='flex items-center gap-2'>
                        <input type='Number' id="discountPrice" min='0' max='10000000' required  className="p-3 border border-gray-300 rounded-lg"  onChange={handleChange} value={formData.discountPrice}/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Prince</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    )}
                    
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
                
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80' disabled={loading || uploading}>{loading ? 'Creating... ' : 'Create Listing'}</button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}

                
            </div>
        </form>
    </main>
  )
}

// after this we want to redirect users to that listing. so we'll have a page that is rendered with an id