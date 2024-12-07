import pkg from 'jsonwebtoken';
const { verify } = pkg; 

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Authorization denied: No token." });
    }

    const bearerToken = token.split(" ")[1]; // extracting the token from "Bearer <token>"

    try {
        const decoded = verify(bearerToken, process.env.JWT_SECRET); // using `verify` here
        // attaching the user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is invalid" });
    }
};

export default authMiddleware;
