import { Router } from "express";
import { 
    addProduct, 
    getProductById, 
    editProduct, 
    removeProduct 
} from "./barang.controller";
import { 
    CreateBorrow, 
    CreateReturn, 
    usageReport 
} from "../Peminjaman/peminjaman.controller";
import { CreateValidation } from "../Peminjaman/peminjaman.validation";
import { 
    addProductValidation, 
    editProductValidation, 
    adminAuth 
} from "./barang.validation";

const router = Router();

// Routes untuk produk
router.post('/', [adminAuth, addProductValidation], addProduct); // Tambah produk
router.get('/:id', [adminAuth], getProductById); // Dapatkan detail produk
router.put('/:id', [adminAuth, editProductValidation], editProduct); // Perbarui produk
router.delete('/:id', [adminAuth], removeProduct); // Hapus produk

//peminjaman
router.post('/peminjaman', [CreateValidation], CreateBorrow);

//pengembalian
router.post('/pengembalian', CreateReturn);

//analyse
router.post('/usage-report', usageReport);   





export default router;

