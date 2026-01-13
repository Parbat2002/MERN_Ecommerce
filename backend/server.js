import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend/config/config.env' });
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.status(200).json({
        message: "All Products"
    })
})

app.listen(port, () => {
    console.log(`Port ${port} is coated with Armament Haki`)
})
