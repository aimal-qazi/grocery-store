import express from 'express';
import { deleteUserProfile, getUserProfile, updateUserProfile, updateUserProfileImage } from '../controllers/profile.controller';
import { protect } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer';

const profileRouter = express.Router();
profileRouter.get('/profile', protect, getUserProfile)
profileRouter.post('/profile', protect, updateUserProfile)
profileRouter.delete('/profile', protect, deleteUserProfile)
profileRouter.put('/profile-avatar', protect, upload, updateUserProfileImage)

export default profileRouter;