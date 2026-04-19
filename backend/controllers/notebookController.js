const Notebook = require("../models/Notebook");

// ─── Helper: get or create the single notebook document ──────────────────────
const getOrCreateNotebook = async () => {
  try {
    let notebook = await Notebook.findOne();
    if (!notebook) {
      notebook = await Notebook.create({ entries: new Map() });
    }
    return notebook;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// ─── CREATE / ADD DATA ────────────────────────────────────────────────────────
/**
 * POST /api/notebook/add
 * Body: { heading: String, data: String }
 *
 * Adds `data` to the array stored under `heading`.
 * Creates the heading field if it does not exist yet.
 */
const addData = async (req, res, next) => {
  try {
    const { heading, data } = req.body;

    if (!heading || !data) {
      const error = new Error("Both 'heading' and 'data' are required.");
      error.statusCode = 400;
      return next(error);
    }

    const notebook = await getOrCreateNotebook();

    // Get existing array for heading, or start a new one
    const existing = notebook.entries.get(heading) || [];
    existing.push(data.trim());
    notebook.entries.set(heading, existing);

    // Mark the Map as modified so Mongoose saves it
    notebook.markModified("entries");
    await notebook.save();

    res.status(201).json({
      success: true,
      message: "Data stored successfully.",
      heading,
      entries: Object.fromEntries(notebook.entries),
    });
  } catch (err) {
    next(err);
  }
};

// ─── READ / GET ALL DATA ──────────────────────────────────────────────────────
/**
 * GET /api/notebook
 *
 * Returns all headings and their stored data arrays.
 */
const getAllData = async (req, res, next) => {
  try {
    const notebook = await getOrCreateNotebook();

    res.status(200).json({
      success: true,
      data: Object.fromEntries(notebook.entries),
    });
  } catch (err) {
    next(err);
  }
};

// ─── READ / GET DATA BY HEADING ───────────────────────────────────────────────
/**
 * GET /api/notebook/:heading
 *
 * Returns the data array for a specific heading.
 */
const getDataByHeading = async (req, res, next) => {
  try {
    const { heading } = req.params;
    const notebook = await getOrCreateNotebook();

    const data = notebook.entries.get(heading);

    if (!data) {
      const error = new Error(`No data found for heading: "${heading}"`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      heading,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE DATA ──────────────────────────────────────────────────────────────
/**
 * PUT /api/notebook/update/:heading
 * Body: { oldData: String, newData: String }
 *
 * Finds `oldData` inside the array at `heading` and replaces it with `newData`.
 * If `data` (full array) is provided instead, it replaces the entire array.
 */
const updateData = async (req, res, next) => {
  try {
    const { heading } = req.params;
    const { oldData, newData, data } = req.body;

    const notebook = await getOrCreateNotebook();
    const field = notebook.entries.get(heading);

    if (!field) {
      const error = new Error(`Heading "${heading}" does not exist.`);
      error.statusCode = 404;
      return next(error);
    }

    if (data && Array.isArray(data)) {
      // Replace entire array
      notebook.entries.set(heading, data);
    } else if (oldData && newData) {
      // Replace a single entry
      const idx = field.indexOf(oldData);
      if (idx === -1) {
        const error = new Error(`Entry "${oldData}" not found under heading "${heading}".`);
        error.statusCode = 404;
        return next(error);
      }
      field[idx] = newData.trim();
      notebook.entries.set(heading, field);
    } else {
      const error = new Error("Provide either { oldData, newData } or a full { data } array.");
      error.statusCode = 400;
      return next(error);
    }

    notebook.markModified("entries");
    await notebook.save();

    res.status(200).json({
      success: true,
      message: `Data under heading "${heading}" updated successfully.`,
      heading,
      data: notebook.entries.get(heading),
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE DATA ──────────────────────────────────────────────────────────────
/**
 * DELETE /api/notebook/delete/:heading
 * Body (optional): { data: String }
 *
 * If `data` is provided  → removes that specific entry from the heading's array.
 * If `data` is omitted   → deletes the entire heading field from the document.
 */
const deleteData = async (req, res, next) => {
  try {
    const { heading } = req.params;
    const { data } = req.body || {};

    const notebook = await getOrCreateNotebook();
    const field = notebook.entries.get(heading);

    if (!field) {
      const error = new Error(`Heading "${heading}" does not exist.`);
      error.statusCode = 404;
      return next(error);
    }

    if (data) {
      // Delete a specific entry inside the heading
      const filtered = field.filter((item) => item !== data);
      if (filtered.length === field.length) {
        const error = new Error(`Entry "${data}" not found under heading "${heading}".`);
        error.statusCode = 404;
        return next(error);
      }
      notebook.entries.set(heading, filtered);
    } else {
      // Delete the entire heading field
      notebook.entries.delete(heading);
    }

    notebook.markModified("entries");
    await notebook.save();

    res.status(200).json({
      success: true,
      message: data
        ? `Entry removed from heading "${heading}".`
        : `Heading "${heading}" deleted successfully.`,
      entries: Object.fromEntries(notebook.entries),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addData, getAllData, getDataByHeading, updateData, deleteData };
