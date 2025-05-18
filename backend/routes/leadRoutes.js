const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', auth(['super_admin', 'sub_admin', 'support_agent']), leadController.getLeads);
router.post('/', auth(['super_admin', 'sub_admin']), leadController.createLead);
router.put('/:id', auth(['super_admin', 'sub_admin', 'support_agent']), leadController.updateLead);
router.delete('/:id', auth(['super_admin', 'sub_admin']), leadController.deleteLead);
router.post('/import', auth(['super_admin', 'sub_admin']), upload.single('file'), leadController.importLeads);
router.get('/export', auth(['super_admin', 'sub_admin']), leadController.exportLeads);
router.post('/:id/notes', auth(['super_admin', 'sub_admin', 'support_agent']), leadController.addNote);
router.put('/:id/assign', auth(['super_admin', 'sub_admin']), leadController.assignLead);

module.exports = router;