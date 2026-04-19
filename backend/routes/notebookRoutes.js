const express = require("express");
const router = express.Router();
const {
  addData,
  getAllData,
  getDataByHeading,
  updateData,
  deleteData,
} = require("../controllers/notebookController");

// GET    /api/notebook              — Retrieve all headings + data
router.get("/", getAllData);

// GET    /api/notebook/:heading     — Retrieve data for a specific heading
router.get("/:heading", getDataByHeading);

// POST   /api/notebook/add          — Add data under a heading
router.post("/add", addData);

// PUT    /api/notebook/update/:heading  — Update an entry under a heading
router.put("/update/:heading", updateData);

// DELETE /api/notebook/delete/:heading — Delete a heading or a specific entry
router.delete("/delete/:heading", deleteData);

module.exports = router;
