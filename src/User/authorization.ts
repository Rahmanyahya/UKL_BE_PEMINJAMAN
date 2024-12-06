import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token tidak ditemukan",
            });
        }

        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Format token tidak valid",
            });
        }

        // Verify token
        const secretKey = process.env.SECRET || "";
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Token tidak valid",
                });
            }

            // Optional: Attach decoded token data to request object
            (req as any).user = decoded;

            next();
        });
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export default authenticateToken;
