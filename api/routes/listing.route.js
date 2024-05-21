import express from 'express'
import { createListing } from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// we also check if the person creating the list is authenticated
router.post('/create', verifyUser , createListing);
// we create a new controller for it

export default router;