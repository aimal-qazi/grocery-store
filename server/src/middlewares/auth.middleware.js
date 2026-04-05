import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorize User' })
        }

        const token = authHeader.split(' ')[0];
        const decodeToken = jwt.decode(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
}