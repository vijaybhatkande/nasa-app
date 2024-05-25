const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootPath = "./uploads"
        const id = req.body?.mbr_id ?? "0"
        const controleNo = req.body?.control_number ?? "0"
        const path = rootPath + "/" + id + "_" + controleNo
        createDirectory(rootPath)
        createDirectory(path)
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const fileType = req.body?.file_type ?? "--"
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileName = uniqueSuffix + '_' + fileType + '_' + file.originalname 
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage });


function createDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
        console.log(`Directory created: ${directoryPath}`);
    } else {
        console.log(`Directory already exists: ${directoryPath}`);
    }
}

module.exports = upload