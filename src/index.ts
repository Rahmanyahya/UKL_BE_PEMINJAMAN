import  Express  from "express";
import UserRouter from "./User/user.router"
import ItemRouter from "./Barang/barang.router"

const app = Express();

app.use(Express.json());

app.use(`/User`, UserRouter)
app.use(`/Barang`, ItemRouter)

const PORT = 1992

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})