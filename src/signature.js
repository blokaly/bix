import BN from "bn.js";
import elliptic from "elliptic";
let utils = elliptic.utils;

class Signature {
   constructor(options) {
      this.r = new BN(options.r, 16);
      this.s = new BN(options.s, 16);
   }

   rmPadding(buf) {
      let i = 0;
      let len = buf.length - 1;
      while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
         i++;
      }
      if (i === 0) {
         return buf;
      }
      return buf.slice(i);
   }

   constructLength(arr, len) {
      if (len < 0x80) {
         arr.push(len);
         return;
      }
      let octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
      arr.push(octets | 0x80);
      while (--octets) {
         arr.push((len >>> (octets << 3)) & 0xff);
      }
      arr.push(len);
   }

   toDER(enc) {
      let r = this.r.toArray();
      let s = this.s.toArray();

      // Pad values
      if (r[0] & 0x80)
         r = [ 0 ].concat(r);
      // Pad values
      if (s[0] & 0x80)
         s = [ 0 ].concat(s);

      r = this.rmPadding(r);
      s = this.rmPadding(s);

      while (!s[0] && !(s[1] & 0x80)) {
         s = s.slice(1);
      }
      let arr = [ 0x02 ];
      this.constructLength(arr, r.length);
      arr = arr.concat(r);
      arr.push(0x02);
      this.constructLength(arr, s.length);
      let backHalf = arr.concat(s);
      let res = [ 0x30 ];
      this.constructLength(res, backHalf.length);
      res = res.concat(backHalf);
      return utils.encode(res, enc);
   }
}

const getLength = (buf, p) => {
   let initial = buf[p.place++];
   if (!(initial & 0x80)) {
      return initial;
   }
   let octetLen = initial & 0xf;
   let val = 0;
   for (let i = 0, off = p.place; i < octetLen; i++, off++) {
      val <<= 8;
      val |= buf[off];
   }
   p.place = off;
   return val;
};

const importDER = (data, enc) => {
   data = utils.toArray(data, enc);
   let p = new Position();
   if (data[p.place++] !== 0x30) {
      return false;
   }
   let len = getLength(data, p);
   if ((len + p.place) !== data.length) {
      return false;
   }
   if (data[p.place++] !== 0x02) {
      return false;
   }
   let rlen = getLength(data, p);
   let r = data.slice(p.place, rlen + p.place);
   p.place += rlen;
   if (data[p.place++] !== 0x02) {
      return false;
   }
   let slen = getLength(data, p);
   if (data.length !== slen + p.place) {
      return false;
   }
   let s = data.slice(p.place, slen + p.place);
   if (r[0] === 0 && (r[1] & 0x80)) {
      r = r.slice(1);
   }
   if (s[0] === 0 && (s[1] & 0x80)) {
      s = s.slice(1);
   }
   return new Signature({r,s});
};

class Position {
   constructor() {
      this.place = 0;
   }
}

export {Signature, importDER}
