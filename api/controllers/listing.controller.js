import Listing from "../models/listing.model.js";
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