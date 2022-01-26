import { EventsClient, ISubscriber, Matchers } from "../../src/clients/events";

describe("test findSubscribers", () => {
  it("should return an exact match when found", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Exact,
      tag: "test/tag",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    client.subscribe(sub);

    const subscribers: ISubscriber[] = client.findSubscribers("test/tag");

    expect(subscribers.length).toBe(1);
    expect(subscribers[0]).toEqual(sub);
  });

  it("not return anything if a match is not found", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Exact,
      tag: "test/tag2",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    client.subscribe(sub);

    const subscribers: ISubscriber[] = client.findSubscribers("test/tag");

    expect(subscribers.length).toBe(0);
  });


  it("should return when a startswith match is found", () => {
    const sub: ISubscriber = {
      matcher: Matchers.StartsWith,
      tag: "test/tag",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    client.subscribe(sub);

    const subscribers: ISubscriber[] =
      client.findSubscribers("test/tag/matcher");

    expect(subscribers.length).toBe(1);
    expect(subscribers[0]).toEqual(sub);
  });

  it("should return when a regex match is found", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Regex,
      tag: "test/.*?/resulting",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    client.subscribe(sub);

    const subscribers: ISubscriber[] = client.findSubscribers(
      "test/anythinghere/resulting"
    );

    expect(subscribers.length).toBe(1);
    expect(subscribers[0]).toEqual(sub);
  });

  it("should return nothing when a regex match is not found", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Regex,
      tag: "test/.*?/resulting",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    client.subscribe(sub);

    const subscribers: ISubscriber[] = client.findSubscribers(
      "testprefix/anythinghere/resulting"
    );

    expect(subscribers.length).toBe(0);
  });
});

describe("subscribe", () => {
  it("should add a subscription when requested", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Exact,
      tag: "test/resulting",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    const id = client.subscribe(sub);

    const subs = client.findSubscribers("test/resulting");

    expect(id).toEqual(1);
    expect(subs.length).toEqual(1);
    expect(subs[0]).toEqual(sub);
  });
});

describe("unsubscribe", () => {
  it("should remove a subscription when requested", () => {
    const sub: ISubscriber = {
      matcher: Matchers.Exact,
      tag: "test/resulting",
      handler: (event: any) => {},
    };

    const client = new EventsClient({
      eauth: "pam",
      endpoint: "http://localhost",
      username: "test",
      password: "test",
    });

    const id = client.subscribe(sub);
    client.unsubscribe(id);

    const subs = client.findSubscribers("test/resulting");

    expect(subs.length).toEqual(0);
  });
});
