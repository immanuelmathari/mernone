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