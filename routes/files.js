const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../config");
var moment = require("moment");
var URL = process.env.MONGO_URL;
const ccxt = require('ccxt');
const rp = require('request-promise');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./tmp/");
  },
  filename: function(req, file, cb) {
    //var datetimestamp = Date.now();
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage,
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
}).single("file");




//--------------------------------
// Get Data
//--------------------------------

router.get("/scraper-data", async (req, res, next) => {
  
  let binanceEx = new ccxt['binance']();
  let bitfinexEx = new ccxt['bitfinex']();
  let coinbaseEx = new ccxt['coinbase']();
  let bitstampEx = new ccxt['bitstamp']();

  await Promise.all([
    binanceEx.loadMarkets(),
    bitfinexEx.loadMarkets(),
    coinbaseEx.loadMarkets(),
    bitstampEx.loadMarkets(),
  ]);
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({})
      .toArray()
      .then(async result => {
        let data = { today: null, day15: null, day30: null };
        // data.today = result[result.length-1];
        // data.day1 = result[result.length-2];
        // data.day15 = result[result.length-3];
        // data.day30 = result[result.length-4];
        result.map(item => {
          if (moment(item.timestamp).isSame(moment(), 'day')) {
            data.today = item;
          }
          if (moment(item.timestamp).isSame(moment().subtract(1, 'days'), 'day')) {
            data.day1 = item;
          }
          if (moment(item.timestamp).isSame(moment().subtract(7, 'days'), 'day')) {
            data.day15 = item;
          }
          if (moment(item.timestamp).isSame(moment().subtract(15, 'days'), 'day')) {
            data.day30 = item;
          }
        })



        let prices = await Promise.all([
          binanceEx.fetchTicker ('BTC/USDT'),
          bitfinexEx.fetchTicker ('BTC/USDT'),
          coinbaseEx.fetchTicker ('BTC/USD'),
          bitstampEx.fetchTicker ('BTC/USD'),
          binanceEx.fetchTicker ('ETH/USDT'),
          bitfinexEx.fetchTicker ('ETH/USDT'),
          coinbaseEx.fetchTicker ('ETH/USD'),
          bitstampEx.fetchTicker ('ETH/USD'),
        ]);
        data.priceTable = {
          binance: {
            BTC: prices[0].last,
            ETH: prices[4].last,
          },
          bitfinex: {
            BTC: prices[1].last,
            ETH: prices[5].last,
          },
          coinbase: {
            BTC: prices[2].last,
            ETH: prices[6].last,
          },
          bitstamp: {
            BTC: prices[3].last,
            ETH: prices[7].last,
          },
        }

        data.priceTable1h = data.day1.priceTable;
        data.priceTable1d = data.day15.priceTable;
        data.priceTable7d = data.day30.priceTable;
        data.priceTable15d = data.day30.priceTable;

        let r = await rp({
          uri: 'https://api.coinmarketcap.com/v2/ticker/825/',
          json: true
        })
        data.tethertotal = r.data.total_supply;
        res.status(200).send(data);





        // Deprecated
        // let prices = await Promise.all([
        //   binanceEx.fetchTicker ('BTC/USDT'),
        //   bitfinexEx.fetchTicker ('BTC/USDT'),
        //   coinbaseEx.fetchTicker ('BTC/USD'),
        //   bitstampEx.fetchTicker ('BTC/USD'),
        //   binanceEx.fetchTicker ('ETH/USDT'),
        //   bitfinexEx.fetchTicker ('ETH/USDT'),
        //   coinbaseEx.fetchTicker ('ETH/USD'),
        //   bitstampEx.fetchTicker ('ETH/USD'),
        // ]);
        // data.priceTable = {
        //   binance: {
        //     BTC: prices[0].ask,
        //     ETH: prices[4].ask,
        //   },
        //   bitfinex: {
        //     BTC: prices[1].ask,
        //     ETH: prices[5].ask,
        //   },
        //   coinbase: {
        //     BTC: prices[2].ask,
        //     ETH: prices[6].ask,
        //   },
        //   bitstamp: {
        //     BTC: prices[3].ask,
        //     ETH: prices[7].ask,
        //   },
        // }

        // prices = await Promise.all([
        //   binanceEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('BTC/USD'),
        //   bitstampEx.fetchOHLCV ('BTC/USD', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        //   binanceEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('ETH/USD'),
        //   bitstampEx.fetchOHLCV ('ETH/USD', '1m', moment().subtract(1, 'hours').unix() * 1000, 1),
        // ]);
        // data.prices1h = prices;
        // data.priceTable1h = {
        //   binance: {
        //     BTC: prices[0][0][1],
        //     ETH: prices[4][0][1],
        //   },
        //   bitfinex: {
        //     BTC: prices[1][0][1],
        //     ETH: prices[5][0][1],
        //   },
        //   coinbase: {
        //     BTC: prices[2].ask,
        //     ETH: prices[6].ask,
        //   },
        //   bitstamp: {
        //     BTC: prices[3][0][1],
        //     ETH: prices[7][0][1],
        //   },
        // }


        // prices = await Promise.all([
        //   binanceEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('BTC/USD'),
        //   bitstampEx.fetchOHLCV ('BTC/USD', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        //   binanceEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('ETH/USD'),
        //   bitstampEx.fetchOHLCV ('ETH/USD', '1m', moment().subtract(1, 'days').unix() * 1000, 1),
        // ]);
        // data.prices1d = prices;
        // data.priceTable1d = {
        //   binance: {
        //     BTC: prices[0][0][1],
        //     ETH: prices[4][0][1],
        //   },
        //   bitfinex: {
        //     BTC: prices[1][0][1],
        //     ETH: prices[5][0][1],
        //   },
        //   coinbase: {
        //     BTC: prices[2].ask,
        //     ETH: prices[6].ask,
        //   },
        //   bitstamp: {
        //     BTC: prices[3][0][1],
        //     ETH: prices[7][0][1],
        //   },
        // }


        // prices = await Promise.all([
        //   binanceEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('BTC/USD'),
        //   bitstampEx.fetchOHLCV ('BTC/USD', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        //   binanceEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        //   bitfinexEx.fetchOHLCV ('ETH/USDT', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        //   coinbaseEx.fetchTicker ('ETH/USD'),
        //   bitstampEx.fetchOHLCV ('ETH/USD', '1m', moment().subtract(7, 'days').unix() * 1000, 1),
        // ]);
        // data.prices7d = prices;
        // data.priceTable7d = {
        //   binance: {
        //     BTC: prices[0][0][1],
        //     ETH: prices[4][0][1],
        //   },
        //   bitfinex: {
        //     BTC: prices[1][0][1],
        //     ETH: prices[5][0][1],
        //   },
        //   coinbase: {
        //     BTC: prices[2].ask,
        //     ETH: prices[6].ask,
        //   },
        //   bitstamp: {
        //     BTC: prices[3][0][1],
        //     ETH: prices[7][0][1],
        //   },
        // }


        // prices = await Promise.all([
        //   binanceEx.fetchOHLCV ('BTC/USDT', '1m', moment().subtract(15, 'days').unix() * 1000, 1),
        // ]);
        // data.priceTable15d = {
        //   bitfinex: {
        //     BTC: prices[0][0][1],
        //   },
        // }

        // let r = await rp({
        //   uri: 'https://api.coinmarketcap.com/v2/ticker/825/',
        //   json: true
        // })
        // data.tethertotal = r.data.total_supply;
        // res.status(200).send(data);
      });
  });
});

























//--------------------------------
// Get File
//--------------------------------

router.get("/:userId/:projectId/:fileId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {
        res.status(200).send(result);
      });
  });
});







//--------------------------------
// Download File
//--------------------------------

router.get("/download/:userId/:projectId/:fileId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {
        res.download('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + (result[0].filepath ? result[0].filepath : result[0].filename))
      });
  });
});


//--------------------------------
// Download Excel File
//--------------------------------
router.get("/report/excel/:fileId", (req, res, next) => {
  
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {

        let renderData = xlxsUtil.getRenderData(result[0]);
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('CommonBrain');

        worksheet.columns = [
          { header: `${result[0].title}`, key: 'A', width: 10 },
          { header: '', key: 'B', width: 10 },
          { header: '', key: 'C', width: 10 },
          { header: '', key: 'D', width: 10 },
          { header: '', key: 'E', width: 20 },
          { header: '', key: 'F', width: 20 },
          { header: '', key: 'G', width: 5 },
          { header: '', key: 'H', width: 20 },
          { header: '', key: 'I', width: 20 },
          { header: '', key: 'J', width: 10 },
        ];
        worksheet.mergeCells('A1:J1');
        worksheet.getRow(1).height = 40;
        worksheet.getCell('A1').font = {
            size: 40,
            bold: true
        };
        let rowNum = 2;
        let row;
        renderData.map(dash=>{
          
          row = worksheet.addRow([`${dash.dash.dashName || ''}  ${dash.dash.name2 || ''}`]);
          row.height = 30;
          row.getCell(1).font = {
              size: 25,
              bold: true
          };
          rowNum ++;
          dash.data.map(sheet=>{
            row = worksheet.addRow(['', `${sheet.name || ''}`]);
            row.height = 25;
            row.getCell(1).font = {
                size: 20,
                bold: true
            };
            rowNum ++;
            sheet.data.map(tab=>{
              row = worksheet.addRow(['', '', `${tab.name || ''}`]);
              row.height = 20;
              row.getCell(1).font = {
                  size: 18,
                  bold: true
              };
              rowNum ++;

              tab.data.map(majcat=>{
                row = worksheet.addRow(['', '', '', `${majcat.name || ''}`]);
                rowNum ++;

                for (let i = 0; i < majcat.data.length; i+=2) {
                  if (i+1 < majcat.data.length) {
                    row = worksheet.addRow(['', '', '', '', `${majcat.data[i].spec_category || ''}`, `${majcat.data[i].formatted || ''}`, '', `${majcat.data[i+1].spec_category || ''}`, `${majcat.data[i+1].formatted || ''}`]);

                    row.getCell(5).alignment = { wrapText: true };
                    row.getCell(6).alignment = { wrapText: true };
                    row.getCell(8).alignment = { wrapText: true };
                    row.getCell(9).alignment = { wrapText: true };
                    rowNum ++;
                  } else {
                    row = worksheet.addRow(['', '', '', '', `${majcat.data[i].spec_category || ''}`, `${majcat.data[i].formatted || ''}`]);

                    row.getCell(5).alignment = { wrapText: true };
                    row.getCell(6).alignment = { wrapText: true };
                    row.getCell(8).alignment = { wrapText: true };
                    row.getCell(9).alignment = { wrapText: true };
                    rowNum++;
                  }
                }
              })
            })
          })
        })

        let filename = `./tmp/${new Date().getTime()}.xlsx`;
        workbook.xlsx.writeFile(filename).then(()=>{
          res.download(filename)
        });
      });
  });
});



//--------------------------------
// Delete File
//--------------------------------

router.delete("/:userId/:projectId/:fileId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  // console.log('Deleteing')
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {
        
        fs.unlink('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + result[0].filename)
        fs.unlink('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + result[0]._id + '.jpg')
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var fileCollection = db.collection("files");
          fileCollection.deleteOne({ _id: ObjectId(fileId) });
          res.status(200).send('Deleted Successfully')
        })
      });
  });
});

//--------------------------------
// Upload File Image
//--------------------------------

router.post("/:userId/:projectId/:fileId/image", (req, res, next) => {
  upload(req, res, function(err) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;
    var fileId = req.params.fileId;
    if(err){
      console.log(err)
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.params.fileId;
    fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
      fs.move('./tmp/' + fileName + extension, './uploads/'+userId+'/'+projectId+'/' + fileName + '_image' + extension, { overwrite: true }).then(result=>{
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var collection = db.collection("files");
          collection.findOne({ _id: ObjectId(fileId) }, { sheet: 0 }).then(result => {
            if (result != null) {
              collection
                .update({ _id: ObjectId(fileId) },{$set : {"image":true}})
                .then(result => {
                  res.status(200).send({message:'uploaded'})
                });
            } else {
              res.status(401).send({ error: err });
            }
          });
        });
        
      })
    });
  })
})

//--------------------------------
// Upload File Logo
//--------------------------------

router.post("/:userId/:projectId/:fileId/logo", (req, res, next) => {
  upload(req, res, function(err) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;
    var fileId = req.params.fileId;
    if(err){
      console.log(err)
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.params.fileId;
    fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
      fs.move('./tmp/' + fileName + extension, './uploads/'+userId+'/'+projectId+'/' + fileName + '_logo' + extension, { overwrite: true }).then(result=>{
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var collection = db.collection("files");
          collection.findOne({ _id: ObjectId(fileId) }, { sheet: 0 }).then(result => {
            if (result != null) {
              collection
                .update({ _id: ObjectId(fileId) },{$set : {"logo":true}})
                .then(result => {
                  res.status(200).send({message:'uploaded'})
                });
            } else {
              res.status(401).send({ error: err });
            }
          });
        });
        
      })
    });
  })
})
//--------------------------------
// Upload File
//--------------------------------

router.post("/:projectId/add", (req, res, next) => {
  fake_background_job("file");
  upload(req, res, function(err) {
    if (err) {
      res.status(401).send({ error: err });
    }
    var projectId = req.params.projectId;
    var userId = req.body.userId;
    // var fileName = req.body.fileName;
    var dir = "/uploads/" + userId + "/" + projectId;
    if(!req.file) {
      res.status(401).json({
        errors: {
          form: 'File is required.'
        }
      });
      return;
    }
    var filename = req.file.filename;

    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;

      var collection = db.collection("files");
      collection
      .find({ project_id: projectId, user_id: userId, filename: filename }, { sheet: 0 })
      .toArray()
      .then(result => {
        if (result.length > 0) {
          res.status(401).json({
            type: 'filename_exist',
            file: result[0]
          });
        } else {

          let timestamp = new Date().getTime();
          let filepath  = filename + '$$$$' + timestamp;
          fs.move("./tmp/" + filename, "./" + dir + "/" + filepath, function(err) {
            if (err) {
              fs.remove("./tmp/" + filename);
              res.status(401).json({
                errors: {
                  form: "File Exists"
                }
              });
            } else {
              let obj = xlxsUtil.parseSheet("./" + dir + "/" + filepath)

              let fileSave = {
                name: filename.substring(0, filename.length - 5),
                filename: filename,
                filepath: filepath,
                file_uploaded: new Date(),
                file_updated: new Date(),
                user_id: userId,
                project_id: projectId,
                rows: obj.rows,
                // sheet: obj.sheet,
                title: obj.title,
                dashes: obj.dashes,
                imageFrom: 'file',
                imageFileUrl: obj.imageFileUrl,
                logoFrom: 'file',
                logoFileUrl: obj.logoFileUrl
              };
              MongoClient.connect(URL, function(err, db) {
                if (err) throw err;
                collection
                  .insert(fileSave)
                  .then(
                    result => {
                      let id = result.insertedIds[0].toString();
                      let newpath = filepath + '$$$' + id + '.xlsx';
                      fs.move("./" + dir + "/" + filepath, "./" + dir + "/" + newpath, function(err) {
                        if (err) {
                        } else {
                          collection
                          .update({ _id: ObjectId(id) },{ $set: {
                            filepath: newpath
                          }}).then(result=>{

                            res.status(200).json({
                              message: "Upload Successful"
                            });
                          })
                        }
                      });
                    },
                    err => {
                      fs.remove("./" + dir + "/" + filepath);
                      res.status(401).send({ error: err });
                    }
                  );
              });
            }
          });
        }
      })
    });
  });
});

//--------------------------------
// Update File 
//--------------------------------
router.put("/update/:userId/:projectId/:fileId", (req, res, next) => {
  var chart = req.body;
  
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");

    collection
      .update({ _id: ObjectId(req.params.fileId) }, {$set:chart})
      .then(
        result => {
          res.status(200).json({
            message: "Update Successfull"
          });
        },
        err => {
          res.status(401).send({ error: err });
        }
      );
  });

})


module.exports = router;
