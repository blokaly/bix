# BIX - Blokaly Information eXchange

Welcome to BIX!

## Table of Contents

 - [Overveiw](#overview)
 - [Usage](#usage)
   - [Requirement](#requirement)
   - [Step by Step](#step-by-step)
     - [download and install](#download-and-install)
     - [upload an image](#upload-an-image)
     - [create an account](#create-an-account)
     - [create an issuer](#create-an-issuer)
     - [create a badge](#create-a-badge)
     - [issue a badge](#issue-a-badge)
     - [display a bao](#display-a-bao)
 - [License](#license)    

## Overview

BIX is an information exchange protocol used by [Blokaly](https://www.blokaly.com) to issue and display badges based on
 Distributed Ledge Technology (DLT).

Want to learn more? Check out the technical details [here](https://blokaly.readthedocs.io/en/latest/). 

If you are interested in this project, join us on [Slack](https://blokalyscope.slack.com) 
or follow us on [Twitter](https://twitter.com/blokaly). 

Please following this [link](https://www.blokaly.com/bao/QmQyyW1YaPz4N4ggnrSKuFwesbXNtgBLcBEB2BeXhMBvhF) to register as 
a member of the Blokaly Community, then you will receive a Slack invite after confirming your email address.

Any feedbacks or helps are welcomed.

## Usage

### Requirement

 - Node.js 4.7 or higher
 - [IPFS](https://ipfs.io)
 
###  Step by Step

#### download and install
 - Clone the project
 ```Bash
 $ git clone git@github.com:blokaly/bix.git
 ```
 
 - Install
 ```Bash
 $ cd bix
 $ npm install
 $ npm run install
 ```
 
 - Run
 ```Bash
 $ npm run bix
 
888888b.   8888888 Y88b   d88P 
888  "88b    888    Y88b d88P  
888  .88P    888     Y88o88P   
8888888K.    888      Y888P    
888  "Y88b   888      d888b    
888    888   888     d88888b   
888   d88P   888    d88P Y88b  
8888888P"  8888888 d88P   Y88b 
                              
Chose one option:
  0. upload an image
  1. create an account
  2. create an issuer
  3. create a badge
  4. issue a badge
  5. display a bao
  q. quit
>  
 ```

#### upload an image
Select option **0** to upload an png image file to IPFS. 
You can use your own image file or choose one of the three pre-made images under images folder.
```Bash
PNG file> ./images/gold.png
  
 [BIX 11:56:59.74] - Image IPFS hash: 'QmcTof1PEHHnHtBjgyG8SNAjJpqUX32N3fKSdtx9tTntLy'
 [BIX 11:56:59.74] - View: http://localhost:8080/ipfs/QmcTof1PEHHnHtBjgyG8SNAjJpqUX32N3fKSdtx9tTntLy
```
 
#### create an account
Select option **1** to create a new account using [LightWallet](https://github.com/ConsenSys/eth-lightwallet)
```Bash
Account Password> *****
  
  [BIX 12:02:42.95] - account secret: 'loyal candy gesture about consider idle abstract cereal resist moral labor day'
  [BIX 12:02:42.95] - account address: 'e8140f6c18fb11d716626a3855b22d65b9cc38c2'
```

#### create an issuer
Select option **2** to create an issuer on IPFS, using the account created in previous step:
```Bash
Issuer Name> Bob
Account Password> *****
Account Secret> loyal candy gesture about consider idle abstract cereal resist moral labor day
  
  [BIX 12:09:52.46] - Issuer IPFS hash: 'QmexQQ1zE3kKhd2HcSM8VCwKwGUBqBzBANB2VCJxgq6S4W'
  [BIX 12:09:52.46] - View: http://localhost:8080/ipfs/QmexQQ1zE3kKhd2HcSM8VCwKwGUBqBzBANB2VCJxgq6S4W
```
The json file uploaded on IPFS looks like:
```json
{
   "type": "bloka.ly/bix/issuer/v1",
   "name": "Bob",
   "account": "e8140f6c18fb11d716626a3855b22d65b9cc38c2"
}
```
 
#### create a badge
Select option **3** to create a badge on IPFS, using the previous created image and issuer:
```Bash
Badge Name> BIX Gold
Badge Description> Gold Cup of BIX
Image IPFS hash> QmcTof1PEHHnHtBjgyG8SNAjJpqUX32N3fKSdtx9tTntLy
Issuer IPFS hash> QmexQQ1zE3kKhd2HcSM8VCwKwGUBqBzBANB2VCJxgq6S4W
  
  [BIX 12:15:49.38] - Badge IPFS hash: 'QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem'
  [BIX 12:15:49.38] - View: http://localhost:8080/ipfs/QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem
``` 
The json file for a badge on IPFS looks like:
```json
{
   "type": "bloka.ly/bix/badge/v1",
   "name": "BIX Gold",
   "description": "Gold Cup of BIX",
   "image": "ipfs://QmcTof1PEHHnHtBjgyG8SNAjJpqUX32N3fKSdtx9tTntLy",
   "issuer": "ipfs://QmexQQ1zE3kKhd2HcSM8VCwKwGUBqBzBANB2VCJxgq6S4W"
}
```
#### issue a badge
Select option **4** to issue a badge on IPFS, using the previous created badge, 
and sign it using the previous created account.

There are two types of badge you can issue, Individual and Group.
Individual badge will be issued to a specific email address 
and the group badge could be used as a template or master badge for subsequent issuances of individual badge.

- Individual Badge
```Bash
Badge IPFS hash> QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem
Chose Badge Type:
   1) Individual
   2) Group
>1
  
  [BIX 12:23:41.99] - your choice:  1
  
Recipient Email> alice@blokaly.com
Account Password> *****
Account Secret> loyal candy gesture about consider idle abstract cereal resist moral labor day
  
  [BIX 12:24:09.02] - BAO IPFS hash: 'QmNvGt3AZ37AtRzXmzD67S1k7wUwh6KRH88rQWxfGxukqs'
  [BIX 12:24:09.02] - View locally: http://localhost:8080/ipfs/QmNvGt3AZ37AtRzXmzD67S1k7wUwh6KRH88rQWxfGxukqs
  [BIX 12:24:09.02] - View on Blokaly: https://www.blokaly.com/bao/QmNvGt3AZ37AtRzXmzD67S1k7wUwh6KRH88rQWxfGxukqs

```
The json file for an issued individual type badge on IPFS looks like:
```json
{
   "type": "bloka.ly/bix/bao/v1",
   "assetType": "Individual",
   "id": "57f15634267bcc72702743c93b49646fd7a9727b9d7bf4fad49bd69422b747e5",
   "recipient": {
      "type": "email",
      "hashed": true,
      "identity": "sha256$513f1cd674fbaebd09b96b5f32d0bb5252d4faa7be9020c77910481fce21e95e",
      "salt": "]nayd5:vV1"
   },
   "asset": "ipfs://QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem",
   "verification": "eyJoYXNoIjoiNTdmMTU2MzQyNjdiY2M3MjcwMjc0M2M5M2I0OTY0NmZkN2E5NzI3YjlkN2JmNGZhZDQ5YmQ2OTQyMmI3NDdlNSIsInYiOjF9.EG0nMGSv8QlqT6tKnhVn6nGuqata7Q-0OWLYRVaA8gpGauu0FUe6k-7_L15r7DdxtK6LUiUjrXOFV_bKjTs4pg",
   "issuedOn": "2017-04-29T04:24:08.987Z"
}
```

- Group Badge
```Bash
Badge IPFS hash> QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem
Chose Badge Type:
   1) Individual
   2) Group
>2
  
  [BIX 12:34:48.65] - your choice:  2
  
Account Password> *****
Account Secret> loyal candy gesture about consider idle abstract cereal resist moral labor day
  
  [BIX 12:35:02.85] - BAO IPFS hash: 'Qmf2XHARBgbTWngx9uByWYurMmGauTNuF3jfqajXJ56W8D'
  [BIX 12:35:02.85] - View locally: http://localhost:8080/ipfs/Qmf2XHARBgbTWngx9uByWYurMmGauTNuF3jfqajXJ56W8D
  [BIX 12:35:02.85] - View on Blokaly: https://www.blokaly.com/bao/Qmf2XHARBgbTWngx9uByWYurMmGauTNuF3jfqajXJ56W8D
```
The json file for an issued group type badge on IPFS looks like:
```json
{
   "type": "bloka.ly/bix/bao/v1",
   "assetType": "Group",
   "id": "11081e7746d080c1321d19742061c4ec4e6f365ceccb010290dad00d461be5e7",
   "recipient": {
      "type": "group",
      "hashed": true,
      "identity": "sha256$ec629af225873c65d30a14ade483e00d1f20de5a7c0a141eec6aecf39504b171",
      "salt": "KH^&2G@X=2"
   },
   "asset": "ipfs://QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem",
   "verification": "eyJoYXNoIjoiMTEwODFlNzc0NmQwODBjMTMyMWQxOTc0MjA2MWM0ZWM0ZTZmMzY1Y2VjY2IwMTAyOTBkYWQwMGQ0NjFiZTVlNyIsInYiOjB9.MFVy9wGW0i53QyNJbekoo-I2ZRbuyc6NmXQZ5jM74L0bIyZiNPHBkNDZ5y2Q-yplQKtI2cvZROKyLjhPUhuAmQ",
   "issuedOn": "2017-04-29T04:35:02.825Z"
}
``` 

#### display a bao 
Select option **5** to display an aggregated view of the issued badge:
```Bash
BAO IPFS hash> QmNvGt3AZ37AtRzXmzD67S1k7wUwh6KRH88rQWxfGxukqs
```
The aggregated view of the issued badge json looks like:
```json
{
   "type": "bloka.ly/bix/bao/v1",
   "assetType": "Individual",
   "id": "57f15634267bcc72702743c93b49646fd7a9727b9d7bf4fad49bd69422b747e5",
   "recipient": {
      "type": "email",
      "hashed": true,
      "identity": "sha256$513f1cd674fbaebd09b96b5f32d0bb5252d4faa7be9020c77910481fce21e95e",
      "salt": "]nayd5:vV1"
   },
   "asset": {
      "ref": "ipfs://QmNvmZTjUd28YwYbULUpvoyhthjuWYKAUdfXYNzfVFquem",
      "type": "bloka.ly/bix/badge/v1",
      "name": "BIX Gold",
      "description": "Gold Cup of BIX",
      "image": "ipfs://QmcTof1PEHHnHtBjgyG8SNAjJpqUX32N3fKSdtx9tTntLy",
      "issuer": {
         "ref": "ipfs://QmexQQ1zE3kKhd2HcSM8VCwKwGUBqBzBANB2VCJxgq6S4W",
         "type": "bloka.ly/bix/issuer/v1",
         "name": "Bob",
         "account": "e8140f6c18fb11d716626a3855b22d65b9cc38c2"
      }
   },
   "verification": {
      "token": "eyJoYXNoIjoiNTdmMTU2MzQyNjdiY2M3MjcwMjc0M2M5M2I0OTY0NmZkN2E5NzI3YjlkN2JmNGZhZDQ5YmQ2OTQyMmI3NDdlNSIsInYiOjF9.EG0nMGSv8QlqT6tKnhVn6nGuqata7Q-0OWLYRVaA8gpGauu0FUe6k-7_L15r7DdxtK6LUiUjrXOFV_bKjTs4pg",
      "signedId": "57f15634267bcc72702743c93b49646fd7a9727b9d7bf4fad49bd69422b747e5",
      "signer": "e8140f6c18fb11d716626a3855b22d65b9cc38c2"
   },
   "issuedOn": "2017-04-29T04:24:08.987Z"
}
```

## License
LGPL-3.0