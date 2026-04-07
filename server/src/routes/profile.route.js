import express from 'express';
import { deleteUserProfile, getUserProfile, updateUserProfile, updateUserProfileImage } from '../controllers/profile.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';

const profileRouter = express.Router();
profileRouter.get('/profile', protect, getUserProfile)
profileRouter.post('/profile', protect, updateUserProfile)
profileRouter.delete('/profile', protect, deleteUserProfile)
profileRouter.put('/profile-avatar', protect, upload.single('profile_image'), updateUserProfileImage)

export default profileRouter;