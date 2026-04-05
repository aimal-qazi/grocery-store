import pool from '../db/db.js';
import uploadToCloudinary from '../utils/upload.js'

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await pool.query(
            'SELECT id, email, profile_image, created_at FROM users where id = $1',
            [id]
        )

        if (user.rows.length === 0) {
            res.status(404).json({message: 'user not found'})
        }

        res.json(user.rows[0])
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const {email} = req.body;
        const {id} = req.user;
    
        const updatedUser = pool.query(
            `UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email, profile_image`,
            [email, id]
        )
    
        res.json({ message: "Profile updated", user: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const deleteUserProfile = async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
        
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete account" });
    }
};

export const updateUserProfileImage = async (req, res) => {
    try {
        if (!req.file) res.status(400).json({message: 'Please upload file'});

        const cloudData = await uploadToCloudinary(req.file.path, 'avatars');
        fs.unlinkSync(req.file.path);
        const result = await pool.query(
            'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING profile_image',
            [cloudData.url, req.user.id]
        );

        res.json({ message: "Image updated", profile_image: result.rows[0].profile_image });    
    } catch (error) {
        res.status(500).json({ message: "Could not update image account" });
    }
}