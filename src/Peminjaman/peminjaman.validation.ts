import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Validasi untuk menambahkan peminjaman
const borrowSchema = Joi.object({
    userId: Joi.number().required().messages({
        "number.base": "userId harus berupa angka",
        "any.required": "userId wajib diisi",
    }),
    productId: Joi.number().required().messages({
        "number.base": "productId harus berupa angka",
        "any.required": "productId wajib diisi",
    }),
    description: Joi.string().required().messages({
        "string.base": "description harus berupa string",
        "any.required": "description wajib diisi",
    }),
    borrowDate: Joi.date().iso().required().messages({
        "date.base": "borrowDate harus berupa tanggal yang valid",
        "any.required": "borrowDate wajib diisi",
        "date.isoDate": "borrowDate harus dalam format tanggal ISO yang valid",
    }),
    returnDate: Joi.date()
        .iso()
        .optional()
        .greater(Joi.ref("borrowDate"))
        .messages({
            "date.base": "returnDate harus berupa tanggal yang valid",
            "date.isoDate": "returnDate harus dalam format tanggal ISO yang valid",
            "date.greater": "returnDate harus lebih besar atau sama dengan borrowDate",
        }),
});

// Middleware validasi untuk penambahan peminjaman
const validateBorrow = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const { error } = borrowSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details.map((detail) => detail.message).join(", "), // Menampilkan semua pesan error
        });
    }
    next();
};

export { validateBorrow };
