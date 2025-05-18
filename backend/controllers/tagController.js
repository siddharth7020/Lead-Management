const Tag = require('../models/Tag');
const Lead = require('../models/Lead');

exports.createTag = async (req, res) => {
  try {
    const tag = new Tag({ name: req.body.name });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTagToLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const tag = await Tag.findById(req.body.tagId);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    if (!lead.tags.includes(tag._id)) {
      lead.tags.push(tag._id);
      await lead.save();
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeTagFromLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.tags = lead.tags.filter(tag => tag.toString() !== req.body.tagId);
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    await Lead.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
    await tag.deleteOne();
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};