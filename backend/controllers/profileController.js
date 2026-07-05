import { promisePool } from '../config/db.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [users] = await promisePool.query('SELECT id, name, email, phone FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const [profiles] = await promisePool.query('SELECT address, image, headline, summary, linkedin, github, website FROM profiles WHERE user_id = ?', [userId]);

        const [education] = await promisePool.query('SELECT id, degree, institute, year FROM education WHERE user_id = ?', [userId]);
        const [skills] = await promisePool.query('SELECT id, skill_name, level FROM skills WHERE user_id = ?', [userId]);
        const [experience] = await promisePool.query('SELECT id, title, company, duration FROM experience WHERE user_id = ?', [userId]);
        const [certifications] = await promisePool.query('SELECT id, name, issuer FROM certifications WHERE user_id = ?', [userId]);
        const [languages] = await promisePool.query('SELECT id, language, proficiency FROM languages WHERE user_id = ?', [userId]);

        const [projects] = await promisePool.query('SELECT id, title, description, link, tech_stack FROM projects WHERE user_id = ?', [userId]);
        
        for (let i = 0; i < projects.length; i++) {
            const [images] = await promisePool.query('SELECT id, image_path FROM project_images WHERE project_id = ?', [projects[i].id]);
            projects[i].images = images;
        }

        res.json({
            user: { ...users[0], ...profiles[0] }, // Merge to serve phone/address uniformly to frontend
            profile: profiles.length > 0 ? profiles[0] : {},
            education,
            skills,
            experience,
            projects,
            certifications,
            languages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, headline, summary, linkedin, github, website } = req.body;
        const image = req.file ? await uploadBufferToCloudinary(req.file.buffer, 'buildyourcv/profiles') : req.body.image;

        const [profiles] = await promisePool.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);

        if (profiles.length > 0) {
            await promisePool.query(
                'UPDATE profiles SET address = ?, image = IFNULL(?, image), headline = ?, summary = ?, linkedin = ?, github = ?, website = ? WHERE user_id = ?',
                [address, image, headline, summary, linkedin, github, website, userId]
            );
        } else {
            await promisePool.query(
                'INSERT INTO profiles (user_id, address, image, headline, summary, linkedin, github, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, address, image, headline, summary, linkedin, github, website]
            );
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const addProject = async (req, res) => {
    try {
        const { title, description, link, tech_stack } = req.body;
        
        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();
            
            const [result] = await connection.query(
                'INSERT INTO projects (user_id, title, description, link, tech_stack) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, title, description, link, tech_stack]
            );
            
            const projectId = result.insertId;
            
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const imageUrl = await uploadBufferToCloudinary(file.buffer, 'buildyourcv/projects');
                    await connection.query(
                        'INSERT INTO project_images (project_id, image_path) VALUES (?, ?)',
                        [projectId, imageUrl]
                    );
                }
            }

            await connection.commit();
            res.status(201).json({ message: 'Project added successfully' });
        } catch (txnErr) {
            await connection.rollback();
            throw txnErr;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createAddHandler = (tableName, fields) => async (req, res) => {
    try {
        const values = fields.map(f => req.body[f]);
        const placeholders = fields.map(() => '?').join(', ');
        
        await promisePool.query(
            `INSERT INTO ${tableName} (user_id, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
            [req.user.id, ...values]
        );
        res.status(201).json({ message: `${tableName} added` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createDeleteHandler = (tableName) => async (req, res) => {
    try {
        await promisePool.query(`DELETE FROM ${tableName} WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
        res.json({ message: `${tableName} removed` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteProject = createDeleteHandler('projects');
export const addEducation = createAddHandler('education', ['degree', 'institute', 'year']);
export const deleteEducation = createDeleteHandler('education');
export const addSkill = createAddHandler('skills', ['skill_name', 'level']);
export const deleteSkill = createDeleteHandler('skills');
export const addExperience = createAddHandler('experience', ['title', 'company', 'duration']);
export const deleteExperience = createDeleteHandler('experience');
export const addCertification = createAddHandler('certifications', ['name', 'issuer']);
export const deleteCertification = createDeleteHandler('certifications');
export const addLanguage = createAddHandler('languages', ['language', 'proficiency']);
export const deleteLanguage = createDeleteHandler('languages');
