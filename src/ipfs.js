import fs from "fs";
import ipfsAPI from "ipfs-api";
import Bluebird from "bluebird";
import {console, jsonConsole} from './logger';

const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

const StreamToValue = Bluebird.promisify((stream, cb) => {
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
   PrintJson(jsonStr);
   return yield IpfsAddText(jsonStr);
});

export const IpfsGetJson = Bluebird.coroutine(function*(hash) {
   let stream = yield ipfs.files.cat(hash);
   let jsonStr = yield StreamToValue(stream);
   return JSON.parse(jsonStr);
});

export const IpfsAddText = Bluebird.coroutine(function*(text) {
   let res = yield ipfs.util.addFromStream(Buffer.from(text));
   return res[0].hash;
});

export const IpfsAddImg = Bluebird.coroutine(function*(imgPath) {
   let imgFile = fs.readFileSync(imgPath);
   let res = yield ipfs.util.addFromStream(imgFile);
   return res[0].hash;
});

export const PrintJson = (json) => {
   console.info();
   jsonConsole.info(json);
   console.info();
};
