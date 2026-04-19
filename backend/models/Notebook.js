const mongoose = require("mongoose");

/**
 * NotebookSchema — A single document in the collection.
 * `entries` is a Map where each key is a "heading" and
 * each value is an array of strings (the notes under that heading).
 *
 * Example document:
 * {
 *   entries: {
 *     "Work":     ["Finish report", "Call client"],
 *     "Personal": ["Buy groceries"],
 *     "Ideas":    ["Build a side project"]
 *   }
 * }
 */
const notebookSchema = new mongoose.Schema(
  {
    entries: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notebook", notebookSchema);
