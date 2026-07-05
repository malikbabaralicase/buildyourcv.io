import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import {
    getProfile, updateProfile,
    addEducation, deleteEducation,
    addSkill, deleteSkill,
    addExperience, deleteExperience,
    addProject, deleteProject,
    addCertification, deleteCertification,
    addLanguage, deleteLanguage
} from '../controllers/profileController.js';

const router = express.Router();

// Files are buffered in memory, then streamed up to Cloudinary in the controllers
// (no local disk writes, so this works unchanged on serverless/ephemeral hosts).
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.route('/')
    .get(getProfile)
    .put(upload.single('image'), updateProfile)
    .post(upload.single('image'), updateProfile);

router.route('/education').post(addEducation);
router.route('/education/:id').delete(deleteEducation);

router.route('/skills').post(addSkill);
router.route('/skills/:id').delete(deleteSkill);

router.route('/experience').post(addExperience);
router.route('/experience/:id').delete(deleteExperience);

// Projects explicitly accepts array of images
router.route('/projects').post(upload.array('images', 5), addProject);
router.route('/projects/:id').delete(deleteProject);

router.route('/certifications').post(addCertification);
router.route('/certifications/:id').delete(deleteCertification);

router.route('/languages').post(addLanguage);
router.route('/languages/:id').delete(deleteLanguage);

export default router;
