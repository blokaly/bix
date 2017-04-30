import {IPFS_PREFIX, Random256Hash, SHA256, SignHash} from "./util";
import moment from "moment";
import bs58 from "bs58";
import multihash from "multihashes";

export const MakeIssuer = (name, account) => {
   let issuer = {};
   issuer["type"] = "bloka.ly/bix/issuer/v1";
   issuer["name"] = name;
   issuer["account"] = account;
   return issuer;
};

export const MakeBadge = (name, description, imgId, issuerId) => {
   let badge = {};
   badge["type"] = "bloka.ly/bix/badge/v1";
   badge["name"] = name;
   badge["description"] = description;
   badge["image"] = IPFS_PREFIX + imgId;
   badge["issuer"] = IPFS_PREFIX + issuerId;
   return badge;
};

export const IssueBadge = (badgeHash, badge, opt, account) => {
   let bao = {};
   bao["type"] = 'bloka.ly/bix/bao/v1';
   bao["assetType"] = opt.type;
   let encoded;
   if ( opt.type==='Individual') {
      encoded = encodeRecipient('email', opt.email);
   } else {
      encoded = encodeRecipient('group', badge.name);
   }

   let sig = signBadge(account, encoded.digest, badgeHash);
   bao["id"] = sig.hash;
   bao["recipient"] = encoded.recipient;
   bao["asset"] = IPFS_PREFIX + badgeHash;
   bao["verification"] = sig.signature;
   bao["issuedOn"] = moment().toISOString();

   return bao;
};

const signBadge = (account, recipient, badge) => {
   let decoded = multihash.decode(bs58.decode(badge));
   let hash = Random256Hash(recipient + decoded.digest.toString('hex'));
   let signature = SignHash(account.ks, account.pwKey, account.address, hash);
   return {hash:hash, signature:signature}
};

const encodeRecipient = (type, text) => {
   let recipient = {};
   let encoded = SHA256(text);
   recipient.type = type;
   recipient.hashed = true;
   recipient.identity = encoded.hash;
   recipient.salt = encoded.salt;
   return {recipient:recipient, digest:encoded.digest};
};