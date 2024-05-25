import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                    <input type='text' id='searchTerm' placeholder='Search' className='border rounded-lg p-3 w-full' />
                </div>
                {/* what flex wrap does is that if the inputs are many it will bring the next one below it */}
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type: </label>
                    {/* note that the effect of flex on the checkbox is that it gets the size of the width defined in the input */}
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5' />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Ammenities: </label>
                    {/* note that the effect of flex on the checkbox is that it gets the size of the width defined in the input */}
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label  className='font-semibold'>Sort: </label>
                    {/* padding generally makes something bigger */}
                    <select id='sort_order' className='border  rounded-lg p-3'>
                        <option>Price hight to low</option>
                        <option>Price Low to High</option>
                        <option>Latest</option>
                        <option>Oldest</option>

                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
        </div>
        <div className=''>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
    </div>
  )
}
