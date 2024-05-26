import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import ListingCard from '../components/ListingCard';

export default function Search() {
    const navigate = useNavigate();
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    }); 
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);

    // console.log(sideBarData);
    console.log(listings);

    const handleChange = (e) => {
        // the inputs are different so we need to have some conditions
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({...sideBarData, type: e.target.id})
        }
        if (e.target.id === 'searchTerm'){
            setSideBarData({...sideBarData, searchTerm: e.target.value})
        }
        if (e.target.id === 'parking'  || e.target.id === 'furnished'  || e.target.id === 'offer'){
            // since it can come from the browser too, it can have boolean values that is why we have these
            setSideBarData({...sideBarData, [e.target.id]: e.target.checked  || e.target.checked === 'true' ? true : false})
        }
        if(e.target.id === 'sort_order'){
            // remember we have two things together that we need to sort
            const sort = e.target.value.split('_')[0] || 'created_at'; // to get the first one
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({...sideBarData, sort, order})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // remember we want to maintain the previous query.
        // means we have to get information of the url first

        const urlParams = new URLSearchParams()
        urlParams.set('type', sideBarData.type)
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('furnished', sideBarData.furnished)
        urlParams.set('offer', sideBarData.offer)
        urlParams.set('sort', sideBarData.sort)
        urlParams.set('order', sideBarData.order)
        // now we convert it to a string
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)

        // what you will find is that when you use this form it will go to the url but if you search using the search in the navigation, it doesnt get updated on the form so we want to work on this
        // how to do that? useEffect
    }

    useEffect(() => {
        // we get info from the url
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(searchTermFromUrl  || typeFromUrl  || parkingFromUrl  || furnishedFromUrl  || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSideBarData({
                searchTerm: searchTermFromUrl  || '', type: typeFromUrl  || 'all', parking: parkingFromUrl === 'true' ? true : false, furnished: furnishedFromUrl === 'true' ? true : false, offer: offerFromUrl === 'true' ? true : false, sort: sortFromUrl  || 'created_at', order: orderFromUrl  || 'desc',
            });
        }

        const fetchListings = async () => {
            // after doing everything, now this function is what we use to call the data
            setLoading(true);
            const searchQuery = urlParams.toString();
            // use our router
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);
        };

        fetchListings();

    }, [location.search]); // we are saying that if there is a change in the location search we change the sidebar data
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                    <input type='text' id='searchTerm' placeholder='Search' className='border rounded-lg p-3 w-full' value={sideBarData.searchTerm} onChange={handleChange} />
                </div>
                {/* what flex wrap does is that if the inputs are many it will bring the next one below it */}
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type: </label>
                    {/* note that the effect of flex on the checkbox is that it gets the size of the width defined in the input */}
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sideBarData.type === 'all'}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        {/* we are saying that its going to be checked when the sideBarData type is that one  */}
                        <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sideBarData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sideBarData.type === 'sale'} />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        {/* we are saying that it will be checked when the sidebar data is true */}
                        <input type='checkbox' id='offer' className='w-5'onChange={handleChange} checked={sideBarData.offer} />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Ammenities: </label>
                    {/* note that the effect of flex on the checkbox is that it gets the size of the width defined in the input */}
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sideBarData.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sideBarData.furnished} />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label  className='font-semibold'>Sort: </label>
                    {/* padding generally makes something bigger */}
                    <select id='sort_order' className='border  rounded-lg p-3' onChange={handleChange} defaultValue={'created_at_desc'}>
                        <option value='regularPrice_desc'>Price hight to low</option>
                        <option value='regularPrice_asc'>Price Low to High</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>

                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>
        {/* because of the w-full in loading and the flex-1 here, the loading will go at the center */}
        <div className='flex-1'> 
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {
                    loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading ...</p>
                    )
                }
                {
                    !loading && listings && listings.map((listing) => (
                        // we do like this to pass the array to the component
                        <ListingCard key={listing._id} listing={listing}/>
                    ))
                }
            </div>
        </div>
    </div>
  )
}
