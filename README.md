# Salt Net API

This tries to be a minimal but extremely helpful client for interacting with the SaltStack Net API. The goal is to provide a simple interface and a 
set of types to minimize the amount of back and forth with the documentation needed.

## Using

```javascript
import { LocalClient, WheelClient, Core, Modules, Runner } from "salt-net-api";

// Create a connection to the Local salt client
export const local = new LocalClient({
  endpoint: process.env.SALT_ENDPOINT!,
  username: process.env.SALT_USERNAME!,
  password: process.env.SALT_PASSWORD!,
  eauth: "file",
});

// Define the request type and the expected response type.
const a2 = await local.exec<Modules.Test.IPingRequest, Modules.Test.IPingResult>({
  fun: "test.ping",
  tgt: "test-site",
});

// You can also execute against the async client where available
const asyncResponse: Core.ILocalAsyncResponse = await local.execAsync<Modules.Service.IRestartRequest>({
  fun: "service.restart",
  kwarg: {
    // The type inference will validate that you are passing this required argument
    name: "service-name",
  },
});

// Other clients are also available
export const wheel = new WheelClient({
  endpoint: process.env.SALT_ENDPOINT!,
  username: process.env.SALT_USERNAME!,
  password: process.env.SALT_PASSWORD!,
  eauth: "file",
});

// This also works for other clients
const a1 = await wheel.exec<Runner.Key.IListRequest, Runner.Key.IListResponse>({
  fun: "key.list",
  match: "pre",
});

// If a type is missing you can easily specify it yourself
interface INginxStatusRequest extends Core.ILocalRequest {
  kwarg: {
    url: string;
  }
}
interface INginxStatusResponse {
  [key: string]: {
    connections: number;
    status: boolean;
  }
}

const customTypeResponse = await local.exec<INginxStatusRequest, INginxStatusResponse>({
  fun: "nginx.status",
  kwarg: {
    url: "http://localhost",
  }
});
```
