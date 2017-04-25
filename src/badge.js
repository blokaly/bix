import {IPFS_PREFIX, Random256Hash, RandomHexId, SHA256, SHA256WithSalt, SignHash} from "./util";
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

export const IssueBadge = (badgeId, badge, opt, account) => {
   let bao = {};
   bao["type"] = 'bloka.ly/bix/bao/v1';
   bao["assetType"] = opt.type;
   let encoded;
   if ( opt.type==='Individual') {
      encoded = encodeRecipient('email', opt.email);
   } else {
      encoded = encodeRecipient('group', badge.name);
   }

   let sig = signBadge(account, encoded.digest, badgeId);
   bao["id"] = sig.hash;
   bao["recipient"] = encoded.recipient;
   bao["asset"] = IPFS_PREFIX + badgeId;
   bao["verification"] = sig.signature;
   bao["issuedOn"] = moment().toISOString();

   return bao;
};

export const CloneBadge = (masterHash, master, passcode, name) => {
   let bao = {};
   bao["type"] = 'bloka.ly/bix/bao/v1';
   bao["assetType"] = 'cloned';
   bao["id"] = RandomHexId(32);
   let recipient = {};
   recipient.type = 'public';
   recipient.hashed = false;
   recipient.identity = name;
   bao["recipient"] = recipient;
   bao["asset"] = IPFS_PREFIX + masterHash;
   bao["verification"] = SHA256WithSalt(passcode, name).hash;
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
   recipient.salt = encoded.salt;
   recipient.identity = encoded.hash;
   return {recipient:recipient, digest:encoded.digest};
};