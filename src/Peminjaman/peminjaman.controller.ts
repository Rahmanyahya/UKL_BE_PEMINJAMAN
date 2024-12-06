import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const addBorrow = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId: number = Number(req.body.userId);
        const productId: number = Number(req.body.productId);
        const borrowDate: Date = new Date(req.body.borrowDate);
        const returnDate = req.body.returnDate ? new Date(req.body.returnDate) : "";
        const description: string = req.body.description;

        // Validasi foreign key
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        const productExists = await prisma.barang.findUnique({
            where: { id: productId },
        });
        if (!productExists) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Tambah data peminjaman
        const newBorrow = await prisma.peminjaman.create({
            data: {
                userId,
                productId,
                borrowDate,
                returnDate,
                description,
            },
        });

        return res.status(200).json({
            message: "Peminjaman berhasil dibuat",
            data: newBorrow,
        });
    } catch (error) {
        console.error("Error saat membuat peminjaman:", error);
        return res.status(500).json({
            message: "Kesalahan internal server",
            error: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

const processReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const borrowId: number = Number(req.body.borrowId);
        const returnDate: Date = new Date(req.body.returnDate); // Tanggal jatuh tempo pengembalian
        const actualReturnDate: Date = new Date(); // Tanggal pengembalian aktual (saat ini)
        const notes: string = req.body.notes || ""; // Catatan pengembalian opsional

        // Validasi peminjaman yang ada
        const borrowExists = await prisma.peminjaman.findUnique({
            where: { id: borrowId },
            include: {
                Barang: true, // Dapatkan informasi barang yang dipinjam
                user: true,   // Dapatkan informasi pengguna
            },
        });

        if (!borrowExists) {
            return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
        }

        // Pastikan tanggal pengembalian valid
        if (!returnDate || isNaN(returnDate.getTime())) {
            return res.status(400).json({ message: "Tanggal pengembalian tidak valid" });
        }

        // Perbarui data peminjaman
        await prisma.peminjaman.update({
            where: { id: borrowId },
            data: {
                returnDate, // Perbarui tanggal pengembalian
            },
        });

        // Tambah data pengembalian
        const newReturn = await prisma.pengembalian.create({
            data: {
                returnDate,
                actualReturnDate, // Tanggal pengembalian aktual
                notes,
                Peminjaman: { connect: { id: borrowId } },
                barang: { connect: { id: borrowExists.barang_id } },
                user: { connect: { id: borrowExists.user_id } },
            },
        });

        return res.status(200).json({
            message: "Pengembalian berhasil diproses",
            data: newReturn,
        });
    } catch (error) {
        console.error("Error saat memproses pengembalian:", error);
        return res.status(500).json({
            message: "Kesalahan internal server",
            error: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

const generateUsageReport = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startDate, endDate, groupBy } = req.body;

        // Validasi input
        if (!startDate || !endDate || !groupBy) {
            return res.status(400).json({
                message: "startDate, endDate, dan groupBy harus disediakan",
            });
        }

        // Query ke database
        const usageAnalysis = await prisma.peminjaman.groupBy({
            by: ["barang_id"],
            where: {
                borrowDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _count: {
                _all: true,
            },
            _sum: {
                userId: true,
            },
        });

        // Response
        return res.status(200).json({
            message: "Laporan penggunaan berhasil dibuat",
            data: {
                analysisPeriod: {
                    startDate,
                    endDate,
                },
                usageAnalysis: usageAnalysis.map((item) => ({
                    group: item[groupBy as keyof typeof item],
                    totalBorrowed: item._count?._all ?? 0,
                    totalReturned: item._sum?.userId ?? 0,
                    itemsInUse: (item._count?._all ?? 0) - (item._sum?.userId ?? 0),
                })),
            },
        });
    } catch (error) {
        console.error("Error saat membuat laporan:", error);
        return res.status(500).json({
            message: "Kesalahan internal server",
        });
    }
};

export { addBorrow, processReturn, generateUsageReport };
