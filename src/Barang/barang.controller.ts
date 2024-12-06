import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({ errorFormat: "minimal" });

// Tambah data produk
const addProduct = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const productName: string = req.body.productName;
        const productCategory: string = req.body.productCategory;
        const productLocation: string = req.body.productLocation;
        const stock: number = req.body.stock;

        const createdProduct = await prismaClient.barang.create({
            data: {
                nameItem: productName,
                category: productCategory,
                location: productLocation,
                qty: stock
            }
        });

        res.status(200).json({
            message: `Produk ${productName} berhasil ditambahkan`,
            data: createdProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
};

// Baca data produk berdasarkan ID
const getProductById = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const productId = req.params.id;

        const productData = await prismaClient.barang.findUnique({
            where: {
                id: Number(productId)
            }
        });

        if (!productData) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            message: "Data produk berhasil ditemukan",
            data: productData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
};

// Update data produk
const editProduct = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const productId = req.params.id;

        const existingProduct = await prismaClient.barang.findFirst({
            where: { id: Number(productId) }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        const {
            productName,
            productCategory,
            productLocation,
            stock
        } = req.body;

        const updatedProduct = await prismaClient.barang.update({
            where: { id: Number(productId) },
            data: {
                nameItem: productName ?? existingProduct.nameItem,
                category: productCategory ?? existingProduct.category,
                location: productLocation ?? existingProduct.location,
                qty: stock ?? existingProduct.qty
            }
        });

        return res.status(200).json({
            message: "Produk berhasil diperbarui",
            data: updatedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
};

// Hapus data produk
const removeProduct = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const productId = req.params.id;

        const productToDelete = await prismaClient.barang.findFirst({
            where: { id: Number(productId) }
        });

        if (!productToDelete) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        const deletedProduct = await prismaClient.barang.delete({
            where: { id: Number(productId) }
        });

        return res.status(200).json({
            message: "Produk berhasil dihapus",
            data: deletedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Terjadi kesalahan server"
        });
    }
};

export { addProduct, getProductById, editProduct, removeProduct };
