import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Skema Validasi untuk Membuat Pengguna Baru
const RegisterUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Nama wajib diisi",
        "string.base": "Nama harus berupa string",
    }),
    role: Joi.string()
        .valid("ADMIN", "USER")
        .required()
        .messages({
            "any.required": "Role wajib diisi",
            "any.only": "Role harus salah satu dari 'ADMIN' atau 'USER'",
        }),
    password: Joi.string().required().messages({
        "any.required": "Password wajib diisi",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email wajib diisi",
        "string.email": "Format email tidak valid",
    }),
    phone: Joi.string().required().messages({
        "any.required": "Nomor telepon wajib diisi",
    }),
    department: Joi.string().required().messages({
        "any.required": "Jurusan wajib diisi",
    }),
});

// Middleware Validasi untuk Membuat Pengguna Baru
const RegisterUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = RegisterUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map((item) => item.message).join(", "),
        });
    }
    next();
};

// Skema Validasi untuk Memperbarui Pengguna
const UpdateUserSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    department: Joi.string().optional(),
    role: Joi.string().valid("ADMIN", "USER").optional().messages({
        "any.only": "Role harus salah satu dari 'ADMIN' atau 'USER'",
    }),
});

// Middleware Validasi untuk Memperbarui Pengguna
const UpdateUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = UpdateUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map((item) => item.message).join(", "),
        });
    }
    next();
};

// Skema Validasi untuk Menghapus Pengguna
const DeleteUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email wajib diisi",
        "string.email": "Format email tidak valid",
    }),
});

// Middleware Validasi untuk Menghapus Pengguna
const DeleteUserValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = DeleteUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map((item) => item.message).join(", "),
        });
    }
    next();
};

// Skema Validasi untuk Login
const LoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email wajib diisi",
        "string.email": "Format email tidak valid",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password wajib diisi",
    }),
});

// Middleware Validasi untuk Login
const LoginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = LoginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map((item) => item.message).join(", "),
        });
    }
    next();
};

export { 
    RegisterUserValidation, 
    UpdateUserValidation, 
    DeleteUserValidation, 
    LoginValidation 
};
