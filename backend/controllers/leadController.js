const Lead = require('../models/Lead');
const XLSX = require('xlsx');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

exports.getLeads = async (req, res) => {
  try {
    const { status, tags, startDate, endDate, search } = req.query;
    let query = req.user.role === 'support_agent' ? { assignedTo: req.user.id } : {};

    if (status) query.status = status;
    if (tags) query.tags = { $in: tags.split(',') };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).populate('tags').populate('assignedTo');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, updatedAt: Date.now() });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (req.user.role === 'support_agent' && lead.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(lead, { ...req.body, updatedAt: Date.now() });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await lead.deleteOne();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.importLeads = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const leads = XLSX.utils.sheet_to_json(sheet);
    await Lead.insertMany(leads);
    res.json({ message: 'Leads imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('tags').populate('assignedTo');
    const data = leads.map(lead => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      tags: lead.tags.map(tag => tag.name).join(', '),
      assignedTo: lead.assignedTo?.name || 'Unassigned',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.notes.push({ content: req.body.content });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.assignedTo = req.body.assignedTo;
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};