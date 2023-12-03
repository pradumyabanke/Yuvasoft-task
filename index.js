const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const router = require("./src/Routes/route");


const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);




module.exports = router;
//===================== [ Database Connection ] ==================/

mongoose
    .connect(
        "mongodb+srv://pradumgurjar2:GdtFUfe86JNv42DL@cluster0.xz2k1il.mongodb.net/"
    )
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err));

app.use("/", router);

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`);
});



//mongodb+srv://pradumgurjar2:GdtFUfe86JNv42DL@cluster0.xz2k1il.mongodb.net/
//GdtFUfe86JNv42DL