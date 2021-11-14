import { SaltClient } from "../client";
import EventSource from "eventsource";

export interface ISaltEvent {
  tag: string;
  data: unknown;
}

export enum Matchers {
  Exact,
  StartsWith,
  Regex,
}

export interface ISubscriber {
  /**
   * Salt event tag to match on
   */
  tag: string;

  /**
   * The type of matcher to compare the tag to
   */
  matcher?: Matchers;

  /**
   * Handler to execute when matching on a tag
   */
  handler: Function;
}

interface Subscribers {
  [key: string]: ISubscriber;
}

export class EventsClient extends SaltClient {
  private subscribers: Subscribers = {};
  private source: EventSource;
  private id: number = 0;

  /**
   * Starts the event stream
   */
  public async start() {
    await this.refreshToken();

    this.source = new EventSource(
      `${this.config.endpoint}/events?token=${this.token}`,
      {
        https: {
          rejectUnauthorized: false,
        },
      }
    );

    this.source.onopen = () => {
      // TODO: Something else??
      console.debug("connected to salt event bus");
    };

    this.source.onerror = (err: any) => {
      // TODO: Reconnect logic?
      console.error(err);
    };

    this.source.onmessage = (message: any) => {
      var event: ISaltEvent = JSON.parse(message.data);
      this.publish(event);
    };
  }

  private async publish(event: ISaltEvent) {
    const subscribers = this.findSubscribers(event.tag);

    for (const subscriber of subscribers) {
      subscriber.handler(event);
    }
  }

  /**
   * Returns a list of matching subscribers for the specific tag
   * @param tag - The tag of the event
   * @returns The matching subscribers
   */
  public findSubscribers(tag: string): ISubscriber[] {
    const subscribers: ISubscriber[] = [];

    for (const id of Object.keys(this.subscribers)) {
      const sub = this.subscribers[id];

      if (sub.matcher === Matchers.Exact && sub.tag === tag) {
        console.log("equals matched event");
        subscribers.push(sub);
      } else if (
        sub.matcher === Matchers.StartsWith &&
        tag.startsWith(sub.tag)
      ) {
        console.log("startswith matched event");
        subscribers.push(sub);
      } else if (sub.matcher === Matchers.Regex) {
        const r = new RegExp(sub.tag);
        if (r.test(tag)) {
          subscribers.push(sub);
        }
      } else {
        // Just in case
        throw new Error("Invalid tag match type");
      }
    }

    return subscribers;
  }

  /**
   * Subscribe to the events stream and execute a handler when an event matches
   * @param subscriber - The subscriber and handler for the event stream
   * @returns The internal id of the subscriber to use to unsubscribe.
   */
  public subscribe(subscriber: ISubscriber): number {
    this.id += 1;

    console.debug(`subscribing to ${subscriber.tag}`);
    this.subscribers[this.id] = {
      tag: subscriber.tag,
      handler: subscriber.handler,
      matcher: subscriber.matcher || Matchers.Exact,
    };

    return this.id;
  }

  /**
   * Stops the event stream
   */
  public stop() {
    this.source.close();
  }

  /**
   * Unsubscribes a handler from the event stream
   * @param id - The id of the handler subscription as returned from subscribe
   */
  public unsubscribe(id: number) {
    console.trace(`removing sub for ${id}`);
    delete this.subscribers[id];
  }

  /**
   * Helper function subscribe and execute a handler on the first message match and return the results
   * @param subscriber - The subscriber to use
   * @typeParam T - The return type of the handler
   * @returns The return value of the handler
   */
  public async fireOnce<T>(subscriber: ISubscriber): Promise<T> {
    return new Promise((resolve, reject) => {
      // TODO error handling

      // Wrap the handler with our own handler to control the flow logic
      const id = this.subscribe({
        tag: subscriber.tag,
        matcher: subscriber.matcher,
        handler: async (event: any) => {
          // event has been found, trigger function
          console.trace("got matching event");

          this.unsubscribe(id);
          resolve(event);
        },
      });
    });
  }
}
