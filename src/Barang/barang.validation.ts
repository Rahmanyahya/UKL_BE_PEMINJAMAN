import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Joi from "joi";

// Middleware untuk otorisasi admin
const adminAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Token tidak ditemukan"
            });
        }
        const token = authHeader.split(" ")[1];
        const secretKey = process.env.SECRET || "";

        const decoded = jwt.verify(token, secretKey) as any;

        if (decoded.role !== "ADMIN") {
            return res.status(403).json({
                message: "Anda tidak memiliki akses"
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Token tidak valid"
        });
    }
};

// Validasi untuk menambah produk
const AddProductSchema = Joi.object({
    productName: Joi.string().required(),
    productCategory: Joi.string().required(),
    productLocation: Joi.string().required(),
    stock: Joi.number().required()
});

const addProductValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validationResult = AddProductSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({
            message: validationResult.error.message
        });
    }
    next();
};

// Validasi untuk memperbarui produk
const EditProductSchema = Joi.object({
    productName: Joi.string().optional(),
    productCategory: Joi.string().optional(),
    productLocation: Joi.string().optional(),
    stock: Joi.number().optional()
});

const editProductValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validationResult = EditProductSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({
            message: validationResult.error.message
        });
    }
    next();
};

export { adminAuth, addProductValidation, editProductValidation };
