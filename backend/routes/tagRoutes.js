const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth(['super_admin', 'sub_admin']), tagController.createTag);
router.get('/', auth(['super_admin', 'sub_admin', 'support_agent']), tagController.getTags);
router.post('/:leadId/tags', auth(['super_admin', 'sub_admin', 'support_agent']), tagController.addTagToLead);
router.delete('/:leadId/tags', auth(['super_admin', 'sub_admin', 'support_agent']), tagController.removeTagFromLead);
router.delete('/:id', auth(['super_admin', 'sub_admin']), tagController.deleteTag);

module.exports = router;