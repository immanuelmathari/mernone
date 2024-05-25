import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
// we add.js in backend so that we dont get an error

export const createListing = async (req,res,next) => {
    try {
        // we need to create a model for the listing
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error)
    {
        next(error);
    }
}

export const deleteListing = async (req,res,next) => {
    // if (req.listing.id !== req.par)
        // our approach is now different. in deleteUser, we were checking if the id
    // of the parameters is the same id of the user in that instance. 
    // in listing we first check if it is there

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(401,'Listing not found'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(404, "You can only delete your own listings"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted")
    } catch (error)
    {
        next(error);
    }
}

export const updateListing = async (req,res,next) => {
    // check if listing exists
    const listing = await Listing.findById(req.params.id);

    if (!listing)
        {
            return next(errorHandler(404, 'Listing not found'));
        }

    if (req.user.id !== listing.userRef)
        {
            return next(errorHandler(401, 'You can only update own account'))
        }

        try{
            const updatedListing = await Listing.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true}
            );
            res.status(201).json(updatedListing);
        } catch (error)
        {
            return next(error);
        }
}

export const getListing = async(req,res,next) => {
    try {

        const listing = await Listing.findById(req.params.id);
        if (!listing)
            {
                return next(errorHandler(404, 'Not found'));
            }
        res.status(200).json(listing);
    } catch (error)
    {
        return next(error);
    }
}

export const getListings = async(req,res,next) => {
    try {
        // limit is for pagination
        // startIndex is to know which page we are in
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer === undefined  || offer === 'false')
        {
            // this is the way to search in a database
            offer = {$in : [false, true] }; // if there is no offer search both false and true. yani bring out all of them
        }

        let furnished = req.query.furnished;
        if (furnished === undefined  || furnished === 'false')
        {
            furnished = {$in : [false,true]};
        }

        let parking = req.query.parking;
        if (parking === undefined  || parking === 'false')
        {
            parking = {$in : [false,true]};
        }

        let type = req.query.type;
        if (type === undefined  || type == 'all')
        {
            type = {$in: ['sale','rent']};
        }

        // the search term we use to search
        const searchTerm = req.query.searchTerm  || '';

        const sort = req.query.sort  || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            // we want to search using regex and we search either if its lowercase or uppercase
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort] : order}
        ).limit(limit).skip(startIndex); 

        return res.status(200).json(listings);
    } catch(error)
    {
        next(error);
    }
}