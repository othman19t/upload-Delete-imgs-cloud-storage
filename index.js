const { format } = require("util");
const express = require("express"); // npm i express
const Multer = require("multer"); // npm i multer@1.4.2 
const cors = require("cors"); // npm i cors
const uid = require("uid"); // npm i uid

const app = express();
const PORT = 8000;
/* auth */
const { Storage } = require("@google-cloud/storage"); // npm i @google-cloud/storage
const storage = new Storage({
  keyFilename: "./inshirahStorgeKey.json",
  projectId: "inshirah-testing",
});
const bucket = storage.bucket("inshirah");
/* end auth */
const multer = Multer();

/** multer config*/
// const multer = Multer({
//   // storage: Multer.memoryStorage(),
//   limits: {
//     //  fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed. TODO: cancel this if you don't want to limit the size of file
//   },
// });

app.use(cors());

/* upload file */
app.post("/upload", multer.single("file"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // generate a new unique file name
  const newName = `${uid()}${Date.now().toString()}.png`;

  //give the file new unique name
  req.file.originalname = newName;

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
    console.log(newName); // name of file was uploaded
  });

  blobStream.end(req.file.buffer);
});
/* end of upload file */

/* delete all files in bucket */
// Process the file upload and upload to Google Cloud Storage.
app.post("/deleteall", (req, res) => {
  bucket.deleteFiles(function (err) {
    console.log(err);
  });
  res.send("hey");
});
/* end of delete all */

/* delete one  file */
const fileToDelete = "14khseuzxap1596006933228.png";

app.post("/deleteone", (req, res) => {
  bucket.deleteFiles(
    {
      prefix: fileToDelete,
    },
    function (err) {
      if (!err) {
        // All files in the `images` directory have been deleted.
        res.send("deleted");
      }
    }
  );
});
/* end delete one  file */

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
