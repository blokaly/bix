import "babel-polyfill";
import readline from "readline";
import * as Steps from "./steps";
import asciify from "asciify";

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});


const usage = (rl) => {
   console.log("Chose one option:");
   console.log("  0. upload an image");
   console.log("  1. create an account");
   console.log("  2. create an issuer");
   console.log("  3. create a badge");
   console.log("  4. issue a badge");
   console.log("  5. display bao");
   console.log("  q. quit");
   rl.prompt();
};

const runStep = (coroutine, rl) => {
   coroutine().then(() => {
      usage(rl);
   }).catch((err) => {
      console.error(err.stack);
      rl.close();
   });
};

asciify('BIX', {font: 'colossal'}, (err, res) => {
   console.log();
   console.log(res.red);
   usage(rl);
});


rl.on('line', (line) => {
   switch (line.trim()) {
      case '0':
         runStep(Steps.UploadImgCo(rl), rl);
         break;
      case '1':
         runStep(Steps.CreateAccountCo(rl), rl);
         break;
      case '2':
         runStep(Steps.CreateIssuerCo(rl), rl);
         break;
      case '3':
         runStep(Steps.CreateBadgeCo(rl), rl);
         break;
      case '4':
         runStep(Steps.IssueBadgeCo(rl), rl);
         break;
      case '5':
         runStep(Steps.DisplayBaoCo(rl), rl);
         break;
      case 'q':
         rl.close();
         break;
      default:
         usage(rl);
         break;
   }
});

rl.on('close', () => {
   process.exit(0);
});

