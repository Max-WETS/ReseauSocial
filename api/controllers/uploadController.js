const User = require("../models/User");
const fs = require("fs");
const { promisify } = require("util");
const stream = require("stream");
const pipeline = promisify(stream.pipeline);

console.log(__dirname);

module.exports.uploadPicture = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw new Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(`${__dirname}/../client/public/person/${fileName}`)
  );

  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $set: { profilePicture: "person/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
