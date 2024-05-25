import express from 'express'
import { createListing , deleteListing, updateListing , getListing  , getListings} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// we also check if the person creating the list is authenticated
router.post('/create', verifyUser , createListing);
// we create a new controller for it
router.delete('/delete/:id', verifyUser, deleteListing);
router.post('/update/:id', verifyUser, updateListing);
router.get('/get/:id', getListing);
// for searching
router.get('/get', getListings);

export default router;