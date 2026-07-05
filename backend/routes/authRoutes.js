import express from 'express';
import multer from 'multer';
import { signupUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `new-user-${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
    }
});
const upload = multer({ storage: storage });

router.post('/signup', upload.single('profileImage'), signupUser);
router.post('/login', loginUser);

export default router;
