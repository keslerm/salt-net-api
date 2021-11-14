# Salt Net API

Salt Net API is a TypeScript client for SaltStack to add essential type checking and validation, as well as make working the somewhat convoluted
data structures of SaltStack much easier.

This library heavily utilizes types to provide a clean interface for interacting with minimal logical code to manage.

## Missing Types

SaltStack has an extremely expansive amount of functions and modules available. Initially, I'm mostly adding them as I need manually and
thus providing a way for you to easily extend types that are missing.

I welcome PRs to add more typings around more functions.

Eventually when things look more solid I might generate these automatically from the Salt API documentation.

## Using This Client

This client provides a few abstractions around the matching Salt clients.

```typescript
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

## Events Client

The SaltStack Event Bus is an incredibly useful tool for building event driven automation and functionality from. The events client allows you to easily
leverage this functionality.

```typescript
import { EventsClient } from 'salt-net-api';

const client = new EventsClient({
  endpoint: process.env.SALT_ENDPOINT!,
  username: process.env.SALT_USERNAME!,
  password: process.env.SALT_PASSWORD!,
  eauth: "file",
});

client.subscribe({
  tag: "salt/auth",
  handler: (event: any) => {
    console.log(event);
  }
});

await client.start();
```

You can also use the helper `fireOnce` method to trigger on the first message

```typescript
client.start();

const result = await client.fireOnce({
  tag: "salt/auth",
  handler: (event: any) => {
    return event.some_data;
  },
});

console.log(result); // contents of event.some_data
```

## Why

I wanted to create a way to easily interact with the SaltStack Net API while also taking advantage of TypeScript's ability to type things to make
it have access to required argument validation and auto completion. The SaltStack API has a massive amount of formatting and data differences between
modules and even within a single module.

Originally I started by implementing functions within each client type for every module but it very quickly became far too much essentially boiler plate
code that was just really wrapping types and executing a simple request.

Eventually I deprecated that version and decided to almost entirely rely on TypeScript's ability to type check and generics. This minimizes the amount
of code that actually needs to be unit tested, thus making everything much simpler. It also makes it easy for people to easy create their own types
for modules that may be missing, or custom modules. 
