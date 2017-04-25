import {IpfsAddImg, IpfsAddJson, IpfsGetJson} from "./ipfs";
import Account from "./account";
import Bluebird from "bluebird";
import {DecodeVerification, ExtractIpfsHash, IPFS_PREFIX} from "./util";
import {IssueBadge, MakeBadge, MakeIssuer} from "./badge";
import readline from "readline";

const questionPromise = (rl, question, hidden=false) => {

   let func;
   if ( hidden) {
      func = (chunk) => {
         let input = chunk.toString();
         switch (input) {
            case '\n':
            case '\r':
            case '\u0004':
               break;
            default:
               if ( rl.line) {
                  readline.clearLine(process.stdout, 0);
                  readline.cursorTo(process.stdout, 0);
                  process.stdout.write(question + new Array(rl.line.length+1).join("*"));
               }
               break;
         }
      };

      process.stdin.on('data', func);
   }

   return new Promise(resolve => {
      rl.question(question, (answer) => {
         if ( hidden) {
            process.stdin.removeListener('data', func);
         }
         resolve(answer);
      })
   })
};

export const CreateAccountCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let opt = {};
      opt.pwd = yield questionPromise(rl, 'password> ', true);
      let account = yield Account(opt);
      let seed = account.ks.getSeed(account.pwKey);
      console.log("secret: '%s'", seed);
      console.log("address: '%s'", account.address);
   });
};

export const CreateIssuerCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let opt = {};
      opt.name = yield questionPromise(rl, 'name> ');
      opt.pwd = yield questionPromise(rl, 'password> ', true);
      opt.secret = yield questionPromise(rl, 'secret> ');
      let account = yield Account(opt);
      let issuer = MakeIssuer(opt.name, account.address);
      let hash = yield IpfsAddJson(issuer);
      console.log("issuer ipfs hash: '%s'", hash);
   });
};

export const CreateBadgeCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let name = yield questionPromise(rl, 'badge name> ');
      let description = yield questionPromise(rl, 'badge description> ');
      let imgId = yield questionPromise(rl, 'image ipfs hash> ');
      let issuerId = yield questionPromise(rl, 'issuer ipfs hash> ');

      let badge = MakeBadge(name, description, imgId, issuerId);
      let hash = yield IpfsAddJson(badge);
      console.log("badge ipfs hash: '%s'", hash);
   });
};

export const IssueBadgeCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let badgeId = yield questionPromise(rl, 'badge ipfs hash> ');
      let typeChoice = 0;
      while (typeChoice<1 || typeChoice>2) {
         let typeStr = yield questionPromise(rl, "Chose badge type:\n\t1) individual\n\t2) group\n>");
         typeChoice = parseInt(typeStr.trim());
         console.log('your choice: ', typeChoice);
      }

      let opt ={};
      if ( typeChoice===1) {
         opt.type = 'Individual';
         opt.email = yield questionPromise(rl, 'recipient email> ');
      } else {
         opt.type = 'Group';
      }

      let pass = {};
      pass.pwd = yield questionPromise(rl, 'password> ');
      pass.secret = yield questionPromise(rl, 'secret> ');
      let account = yield Account(pass);
      let badge = yield IpfsGetJson(badgeId);
      let assert = IssueBadge(badgeId, badge, opt, account);
      let hash = yield IpfsAddJson(assert);
      console.log("bao ipfs hash: '%s'", hash);
   });
};

export const ViewBadgeCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let assertId = yield questionPromise(rl, 'bao ipfs hash> ');
      let bao = Object.assign({id: IPFS_PREFIX + assertId}, yield IpfsGetJson(assertId));

      let badgeId = ExtractIpfsHash(bao.asset);
      bao.badge = Object.assign({id: IPFS_PREFIX + badgeId}, yield IpfsGetJson(badgeId));

      let issuerId = ExtractIpfsHash(bao.badge.issuer);
      bao.badge.issuer = Object.assign({id: IPFS_PREFIX + issuerId}, yield IpfsGetJson(issuerId));

      bao.verification = DecodeVerification(bao.verification);

      console.log(JSON.stringify(bao, undefined, 3));

      return bao;
   });
};

export const UploadImgCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let imgPath = yield questionPromise(rl, 'img path> ');
      let hash = yield IpfsAddImg(imgPath);
      console.log("image ipfs hash: '%s'", hash);
   });
};