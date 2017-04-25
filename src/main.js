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
   console.log("  1. create an account");
   console.log("  2. create an issuer");
   console.log("  3. create a badge");
   console.log("  4. issue a badge");
   console.log("  5. view badge info");
   console.log("  6. upload an image");
   console.log("  0. quit");
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

asciify('BIX', {font:'colossal'}, (err, res) => {
   console.log();
   console.log(res);
   usage(rl);
});



rl.on('line', (line) => {
   switch (line.trim()) {
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
         runStep(Steps.ViewBadgeCo(rl), rl);
         break;
      case '6':
         runStep(Steps.UploadImgCo(rl), rl);
         break;
      case '0':
         rl.close();
         break;
      default:
         usage(rl);
         break;
   }
});

rl.on('close', () => {
   console.log('Have a great day!');
   process.exit(0);
});

