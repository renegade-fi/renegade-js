### Getting Started
`import Renegade, { Keychain } from "@renegade-fi/renegade-js"`
```
const keychain = new Keychain();
const renegade = new Renegade();
const walletId = renegade.registerWallet(keychain);
```