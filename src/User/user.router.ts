import { Router } from "express";
import { 
    registerUser, 
    getUsers, 
    updateUserDetails, 
    removeUser, 
    loginUser 
} from "./user.controller";
import { 
    RegisterUserValidation, 
    UpdateUserValidation, 
    DeleteUserValidation, 
    LoginValidation 
} from "./user.validation";
import verifyToken from "./authorization";

const router = Router();

// Route untuk Membuat Pengguna Baru
router.post("/", [RegisterUserValidation], registerUser);

// Route untuk Membaca Daftar Pengguna
router.get("/", [verifyToken], getUsers);

// Route untuk Memperbarui Data Pengguna
router.put("/:id", [verifyToken, UpdateUserValidation], updateUserDetails);

// Route untuk Menghapus Pengguna
router.delete("/:id", [verifyToken, DeleteUserValidation], removeUser);

// Route untuk Login Pengguna
router.post("/login", [LoginValidation], loginUser);

export default router;



