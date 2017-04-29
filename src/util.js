import lightwallet from "eth-lightwallet";
import ethjsUtil from "ethereumjs-util";
import crypto from "crypto";
import {importDER, Signature} from "./signature";
import sigFormatter from "ecdsa-sig-formatter";
import base64url from "base64url";

const signing = lightwallet.signing;
const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-./:;<=>?@[\\]^_`{|}~";

export const LOCAL_IPFS = 'http://localhost:8080/ipfs/';
export const IPFS_PREFIX = 'ipfs://';

const randomTextFrom = (longStr, length) => {
   let retVal = "";
   for (let i = 0, n = longStr.length; i < length; ++i) {
      retVal += longStr.charAt(Math.floor(Math.random() * n));
   }
   return retVal;
};

export const AddHex = (hashString) => {
   return ethjsUtil.addHexPrefix(hashString);
};

export const StripHex = (hashString) => {
   return ethjsUtil.stripHexPrefix(hashString);
};

export const ExtractIpfsHash = (hashUri) => {
   if (hashUri.startsWith(IPFS_PREFIX)) {
      return hashUri.slice(7).trim();
   }
   return hashUri;
};

export const SHA256 = (plainText) => {
   return SHA256WithSalt(plainText, RandomText(10));
};

export const SHA256WithSalt = (plainText, salt) => {
   let sum = crypto.createHash('sha256');
   sum.update(plainText + salt);
   let digest = sum.digest('hex');
   return {hash: 'sha256$' + digest, digest:digest, salt: salt};
};

export const RandomHexId = (length) => {
   return crypto.randomBytes(length).toString('hex');
};

/**
 * @return {string}
 */
export const RandomText = (length) => {
   return randomTextFrom(charset, length);
};

export const Random256Hash = (longHashString) => {
   return randomTextFrom(longHashString, 64);
};

/**
 * @return {boolean}
 */
export const VerifySha256 = (text, salt, hash) => {
   let encoded = SHA256WithSalt(text, salt);
   return encoded.hash === hash;
};

/**
 * @return {string}
 */
export const SignHash = (ks, key, address, hash) => {
   let signed = signing.signMsgHash(ks, key, hash, AddHex(address));
   let sig = new Signature(signed);
   let secret = sigFormatter.derToJose(new Buffer(sig.toDER('secp256k1')), 'ES256');
   let payload = base64url.encode(JSON.stringify({hash: hash, v: signed.v - 27}));
   let token = [];
   token.push(payload);
   token.push(secret);
   return token.join('.');
};

export const DecodeVerification = (token) => {
   let part = token.split('.');
   let payload = JSON.parse(base64url.decode(part[0]));
   let sig = importDER(sigFormatter.joseToDer(part[1], 'ES256'), 'ES256');
   let hashBuf = new Buffer(payload.hash, 'hex');
   let pub = ethjsUtil.ecrecover(hashBuf, payload.v + 27, sig.r, sig.s);
   let address = ethjsUtil.pubToAddress(pub).toString('hex');

   return {token:token, signedId: payload.hash, signer: address};
};