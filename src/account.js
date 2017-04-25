import lightwallet from "eth-lightwallet";
import Bluebird from "bluebird";
import {RandomText} from "./util";
import Random from "meteor-random";
import bip39 from "bip39";

let Keystore = lightwallet.keystore;
let createKs = (password, secretSeed) => {
   return new Promise((resolve, reject)=>{
      Keystore.createVault({
         password: password,
         seedPhrase:secretSeed
      }, function (err, ks) {
         if (err) {
            reject(err);
         } else {
            resolve(ks);
         }
      })
   })
};

export default Bluebird.coroutine(function *(pass) {
   if ( !pass ) {
      pass = {pwd:undefined, secret:undefined};
   }
   let password = pass.pwd || RandomText(10);
   let secretSeed = pass.secret || bip39.entropyToMnemonic(Random.hexString(32));
   let ks = yield createKs(password, secretSeed);
   let getKeyAsync = Bluebird.promisify(ks.keyFromPassword, {context: ks});
   let pwDerivedKey = yield getKeyAsync(password);
   let wallet_hdpath = "m/44'/60'/0'/0";
   ks.addHdDerivationPath(wallet_hdpath, pwDerivedKey, {curve: 'secp256k1', purpose: 'sign'});
   ks.setDefaultHdDerivationPath(wallet_hdpath);
   ks.generateNewAddress(pwDerivedKey, 1);
   let address = ks.getAddresses()[0];
   return {ks:ks, pwKey:pwDerivedKey, address:address};
});