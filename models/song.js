const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Song", SongSchema);
