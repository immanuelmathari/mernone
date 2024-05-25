import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landLord , setLandLord] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    }

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandLord(data);
                // console.log(landLord);
            } catch(error) {
                console.log(error);
            }
        }
        fetchLandLord();
    }, [listing.userRef])
  return (
    // we have gone to create api route for getting information for a landlord
    <>
    {landLord && (
        <div className='flex flex-col gap-2'>
            <p>
                Contact <span className='font-semibold'>{landLord.username},</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
            </p>
            <textarea name='message' id='message' rows='2' value={message} onChange={onChange} placeholder='Enter your message here ... ' className='w-full border p-3 rounded-lg'>

            </textarea>
            <Link to={`mailto:${landLord.email}?subject=Regarding ${listing.name} &body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>

            send message
            </Link>
        </div>
    )}
    </>
  )
}
