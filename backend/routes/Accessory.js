import express from 'express';
import multer from 'multer';
import path from 'path';
import Accessory from '../models/Accessory.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'model/gltf-binary', // Standard for .glb files
      'application/octet-stream', // Some systems use this
      'application/gltf-binary' // Alternative .glb type
    ];
  
    console.log('Uploaded file MIME type:', file.mimetype);
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .glb files are allowed'), false);
    }
  },
});

// Create a new accessory (POST)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { petType, name, description, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `/uploads/${req.file.filename}`;

    const accessory = new Accessory({
      petType,
      name,
      description,
      price: parseFloat(price),
      filePath,
    });

    await accessory.save();
    res.status(201).json(accessory);
  } catch (error) {
    console.error('Error creating accessory:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch all accessories (GET)
router.get('/', async (req, res) => {
  try {
    const accessories = await Accessory.find();
    res.json(accessories);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update an accessory (PUT)
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { petType, name, description, price } = req.body;
    const updateData = { petType, name, description, price: parseFloat(price) };

    if (req.file) {
      updateData.filePath = `/uploads/${req.file.filename}`;
    }

    const accessory = await Accessory.findByIdAndUpdate(id, updateData, { new: true });
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    res.json(accessory);
  } catch (error) {
    console.error('Error updating accessory:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete an accessory (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const accessory = await Accessory.findByIdAndDelete(id);
    if (!accessory) {
      return res.status(404).json({ message: 'Accessory not found' });
    }
    res.json({ message: 'Accessory deleted successfully' });
  } catch (error) {
    console.error('Error deleting accessory:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;