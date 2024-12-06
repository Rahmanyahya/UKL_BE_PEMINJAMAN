import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" });

// Menambahkan data pengguna baru
const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, password, email, phone, role, department } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email sudah terdaftar",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
                numberPhone: phone,
                role: role as UserRole,
                jurusan: department,
            },
        });

        return res.status(200).json({
            message: "Pengguna berhasil dibuat",
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Menampilkan daftar pengguna
const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search as string;

        const users = await prisma.user.findMany({
            where: {
                name: { contains: search || "" },
            },
        });

        return res.status(200).json({
            message: "Data pengguna berhasil diambil",
            data: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Memperbarui data pengguna
const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const { name, email, phone, department } = req.body;

        const user = await prisma.user.findFirst({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan",
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name: name || user.name,
                email: email || user.email,
                numberPhone: phone || user.numberPhone,
                jurusan: department || user.jurusan,
            },
        });

        return res.status(200).json({
            message: "Data pengguna berhasil diperbarui",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Menghapus pengguna
const removeUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const user = await prisma.user.findFirst({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan",
            });
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Pengguna berhasil dihapus",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// Autentikasi pengguna
const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Password salah",
            });
        }

        const payload = {
            email: user.email,
            role: user.role,
        };

        const secretKey = process.env.SECRET || "";
        const token = Jwt.sign(payload, secretKey);

        return res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.numberPhone,
                department: user.jurusan,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export { registerUser, getUsers, updateUserProfile, removeUser, loginUser };
