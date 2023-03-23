"use strict";

var multer = require("multer");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var path = require("path");

var _require2 = require("@google-cloud/storage"),
    Storage = _require2.Storage;

var serviceAccount = require("../config/serviceAccount.json"); // Khởi tạo Storage của Firebase


var storage = new Storage({
  projectId: "auth-fhome",
  keyFilename: path.join(__dirname, "../config/serviceAccount.json")
}); // Lấy reference đến bucket trong Firebase Storage

var bucket = storage.bucket("auth-fhome.appspot.com"); // Khởi tạo middleware upload ảnh với Multer

var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  // giới hạn kích thước file là 5MB
  fileFilter: function fileFilter(req, file, cb) {
    // Kiểm tra định dạng file
    var allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      var error = new Error("Invalid file type.");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }

    return cb(null, true);
  }
}).single("img"); // Middleware upload ảnh

var uploadImage = function uploadImage(req, res, next) {
  upload(req, res, function _callee2(err) {
    var filePath, fileUpload, blobStream;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!err) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              status: "Fail",
              message: "loi upload"
            }));

          case 2:
            if (req.file) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              status: "Fail",
              message: "Please select an image to upload."
            }));

          case 4:
            _context2.prev = 4;
            // Tạo đường dẫn trong Firebase Storage
            filePath = "rooms/".concat(uuidv4()).concat(path.extname(req.file.originalname));
            fileUpload = bucket.file(filePath); // Khởi tạo stream để upload file lên Firebase Storage

            blobStream = fileUpload.createWriteStream({
              metadata: {
                contentType: req.file.mimetype
              }
            }); // Xử lý lỗi trong quá trình upload

            blobStream.on("error", function (error) {
              console.log(error);
              return res.status(400).json({
                status: "Fail",
                message: error.message
              });
            }); // Khi upload hoàn tất, gán đường dẫn vào trường img trong body của request

            blobStream.on("finish", function _callee() {
              var file, publicUrl;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      // req.body.img = `gs://${serviceAccount.project_id}/${filePath}`;
                      file = bucket.file(filePath);
                      _context.next = 3;
                      return regeneratorRuntime.awrap(file.getSignedUrl({
                        action: "read"
                      }));

                    case 3:
                      publicUrl = _context.sent;
                      req.body.img = publicUrl[0];
                      next();

                    case 6:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }); // Ghi dữ liệu vào stream và kết thúc stream

            blobStream.end(req.file.buffer);
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](4);
            console.log(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              status: "Fail",
              message: "Something went wrong. Please try again later."
            }));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[4, 13]]);
  });
};

module.exports = uploadImage;