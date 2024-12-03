import pkg from 'jsonwebtoken';
const { verify } = pkg;


const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if(!token) return res.status(401).json({error: "Authorization denied: No token."});
    
    const bearerToken = token.split(" ")[1]; // extract the token from "Bearer <token>"

    try{
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        // attach the user ID to the request object
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(401).json({error: "Token is invalid"});
    }
};
export default authMiddleware