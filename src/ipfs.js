import fs from "fs";
import ipfsAPI from "ipfs-api";
import Bluebird from "bluebird";

let ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

let StreamToValue = Bluebird.promisify((stream, cb) => {
   let str = '';

   stream.on('data', function (data) {
      str += data.toString()
   });
   stream.on('end', function () {
      cb(null, str)
   });
   stream.on('error', function (err) {
      cb(err)
   })
});

export const IpfsAddJson = Bluebird.coroutine(function*(json) {
   let jsonStr = JSON.stringify(json, undefined, 3);
   console.log(jsonStr);
   return yield IpfsAddText(jsonStr);
});

export const IpfsGetJson = Bluebird.coroutine(function*(hash) {
   console.log("Getting json from ipfs: ", hash);
   let stream = yield ipfs.files.cat(hash);
   let jsonStr = yield StreamToValue(stream);
   return JSON.parse(jsonStr);
});

export const IpfsAddText = Bluebird.coroutine(function*(text) {
   console.log("Adding text to ipfs: ", text);
   let res = yield ipfs.util.addFromStream(Buffer.from(text));
   return res[0].hash;
});

export const IpfsAddImg = Bluebird.coroutine(function*(imgPath) {
   let imgFile = fs.readFileSync(imgPath);
   let res = yield ipfs.util.addFromStream(imgFile);
   return res[0].hash;
});
