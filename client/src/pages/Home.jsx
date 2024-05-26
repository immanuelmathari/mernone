import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try{
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        // call the next function
        fetchRentListing();
      }catch(error)
      {
        console.log(error);
      }
    } 
    const fetchRentListing = async () => {
      try{
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListing();
      }catch(error)
      {
        console.log(error);
      }
    }

    const fetchSaleListing = async () => {
      try{
        const res =await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch(error)
      {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'> 
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span> <br/> place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>Captain Mathari Estate is the best place to find your next perfect place to live <br/> we have a wide 
        range of properties for you to choose from</div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started
        </Link>

      </div>

      {/* swipper */}

      <Swiper navigation>

      {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            {/* swiper doesnt work with the normal style its like css */}
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover"}} className='h-[500px]' key={listing._id}>

            </div>
          </SwiperSlide>
        ))
      }
        
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Offers
              </h2>
              <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Places for rent
              </h2>
              <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Places for sale
              </h2>
              <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
