import {IpfsAddImg, IpfsAddJson, IpfsGetJson, PrintJson} from "./ipfs";
import Account from "./account";
import Bluebird from "bluebird";
import {DecodeVerification, ExtractIpfsHash, IPFS_PREFIX, LOCAL_IPFS} from "./util";
import {IssueBadge, MakeBadge, MakeIssuer} from "./badge";
import {console, colorConsole} from "./logger";
import readline from "readline";

const questionPromise = (rl, question, hidden = false) => {

   let func;
   if (hidden) {
      func = (chunk) => {
         let input = chunk.toString();
         switch (input) {
            case '\n':
            case '\r':
            case '\u0004':
               break;
            default:
               if (rl.line) {
                  readline.clearLine(process.stdout, 0);
                  readline.cursorTo(process.stdout, 0);
                  process.stdout.write(question + new Array(rl.line.length + 1).join("*"));
               }
               break;
         }
      };

      process.stdin.on('data', func);
   }

   return new Promise(resolve => {
      rl.question(question, (answer) => {
         if (hidden) {
            process.stdin.removeListener('data', func);
         }
         resolve(answer);
      })
   })
};

export const CreateAccountCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let opt = {};
      opt.pwd = yield questionPromise(rl, 'Account Password> ', true);
      let account = yield Account(opt);
      let seed = account.ks.getSeed(account.pwKey);
      console.info();
      colorConsole.info("account secret: '%s'", seed);
      colorConsole.info("account address: '%s'", account.address);
      console.info();
   });
};

export const CreateIssuerCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let opt = {};
      opt.name = yield questionPromise(rl, 'Issuer Name> ');
      opt.pwd = yield questionPromise(rl, 'Account Password> ', true);
      opt.secret = yield questionPromise(rl, 'Account Secret> ');
      let account = yield Account(opt);
      let issuer = MakeIssuer(opt.name, account.address);
      let hash = yield IpfsAddJson(issuer);
      colorConsole.info("Issuer IPFS hash: '%s'", hash);
      colorConsole.info("View: " + LOCAL_IPFS + hash);
      console.info();
   });
};

export const CreateBadgeCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let name = yield questionPromise(rl, 'Badge Name> ');
      let description = yield questionPromise(rl, 'Badge Description> ');
      let imgId = yield questionPromise(rl, 'Image IPFS hash> ');
      let issuerId = yield questionPromise(rl, 'Issuer IPFS hash> ');

      let badge = MakeBadge(name, description, imgId, issuerId);
      let hash = yield IpfsAddJson(badge);
      colorConsole.info("Badge IPFS hash: '%s'", hash);
      colorConsole.info("View: " + LOCAL_IPFS + hash);
      console.info();
   });
};

export const IssueBadgeCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let badgeHash = yield questionPromise(rl, 'Badge IPFS hash> ');
      let typeChoice = 0;
      while (typeChoice < 1 || typeChoice > 2) {
         let typeStr = yield questionPromise(rl, "Chose Badge Type:\n   1) Individual\n   2) Group\n>");
         typeChoice = parseInt(typeStr.trim());
         console.info();
         colorConsole.info('your choice: ', typeChoice);
         console.info();
      }

      let opt = {};
      if (typeChoice === 1) {
         opt.type = 'Individual';
         opt.email = yield questionPromise(rl, 'Recipient Email> ');
      } else {
         opt.type = 'Group';
      }

      let pass = {};
      pass.pwd = yield questionPromise(rl, 'Account Password> ', true);
      pass.secret = yield questionPromise(rl, 'Account Secret> ');
      let account = yield Account(pass);
      let badge = yield IpfsGetJson(badgeHash);
      let assert = IssueBadge(badgeHash, badge, opt, account);
      let hash = yield IpfsAddJson(assert);
      colorConsole.info("BAO IPFS hash: '%s'", hash);
      colorConsole.info("View locally: " + LOCAL_IPFS + hash);
      colorConsole.info("View on Blokaly: https://www.blokaly.com/bao/" + hash);
      console.info();
   });
};

export const DisplayBaoCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let baoHash = yield questionPromise(rl, 'BAO IPFS hash> ');
      let bao = yield IpfsGetJson(baoHash);
      let badgeHash = ExtractIpfsHash(bao.asset);
      bao.asset = Object.assign({ref: IPFS_PREFIX + badgeHash}, yield IpfsGetJson(badgeHash));

      let issuerHash = ExtractIpfsHash(bao.asset.issuer);
      bao.asset.issuer = Object.assign({ref: IPFS_PREFIX + issuerHash}, yield IpfsGetJson(issuerHash));
      bao.verification = DecodeVerification(bao.verification);

      PrintJson(JSON.stringify(bao, undefined, 3));
   });
};

export const UploadImgCo = (rl) => {
   return Bluebird.coroutine(function*() {
      let imgPath = yield questionPromise(rl, 'PNG file> ');
      let hash = yield IpfsAddImg(imgPath);
      console.info();
      colorConsole.info("Image IPFS hash: '%s'", hash);
      colorConsole.info("View: " + LOCAL_IPFS + hash);
      console.info();
   });
};