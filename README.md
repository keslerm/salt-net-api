# Salt Net API

This is a very opinionated client for the Salt Net API. The data from the Salt API is honestly a mess and so this is my attempt to handle it better. 

There is a good chance this doesn't cover all use cases so I am open to some PR.

Note: This is a work in progress

## Using

Really simply, it follows a very similar setup tha the python netapi does and also exposes some helper stuff


```javascript
import { LocalClient, WheelClient } from "salt-net-api";

export const saltClientLocal = new LocalClient({
  endpoint: process.env.SALT_ENDPOINT!,
  username: process.env.SALT_USERNAME!,
  password: process.env.SALT_PASSWORD!,
  eauth: "file",
});

const a2 = saltClientLocal.testPing({
  tgt: "test-site",
});

export const saltClientWheel = new WheelClient({
  endpoint: process.env.SALT_ENDPOINT!,
  username: process.env.SALT_USERNAME!,
  password: process.env.SALT_PASSWORD!,
  eauth: "file",
});

const a1 = saltClientWheel.listKeys({
  match: "pre",
})
```