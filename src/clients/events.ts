import { SaltClient } from "../client";
import EventSource from "eventsource";
import { randomUUID } from "crypto";

export interface ISaltEvent {
  tag: string;
  data: unknown;
}

export enum Matchers {
  Exact,
  StartsWith,
  Regex,
  MQTT,
}

export interface ISubscriber {
  /**
   * Salt event tag to match on
   */
  tag: string;

  /**
   * The type of matcher to compare the tag to
   */
  matcher: Matchers;

  /**
   * Handler to execute when matching on a tag
   */
  handler: (event: { tag: string; data: unknown }) => void;

  /**
   * Specify a custom ID for this subscription, if none specified a random one is generated
   */
  id?: string;
}

interface Subscribers {
  [key: string]: ISubscriber;
}

export class EventsClient extends SaltClient {
  private subscribers: Subscribers = {};
  private source: EventSource;

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
      this.config.logger?.debug("connected to salt event bus");
    };

    this.source.onerror = async (err: any) => {
      // TODO: Reconnect logic?
      this.config.logger?.error(err);

      // re-connect if authorized denied
      if (err && err.status === 401) {
        this.config?.logger.info("force refreshing token");
        await this.refreshToken(true);
        await this.start();
      }
    };

    this.source.onmessage = (message: any) => {
      var event: ISaltEvent = JSON.parse(message.data);
      this.publish(event);
    };
  }

  public async publish(event: ISaltEvent) {
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

      if (sub.matcher === Matchers.Exact) {
        if (sub.tag === tag) {
          subscribers.push(sub);
        }
      } else if (sub.matcher === Matchers.StartsWith) {
        if (tag.startsWith(sub.tag)) {
          subscribers.push(sub);
        }
      } else if (sub.matcher === Matchers.Regex) {
        const r = new RegExp(sub.tag);
        if (r.test(tag)) {
          subscribers.push(sub);
        }
      } else if (sub.matcher === Matchers.MQTT) {
        if (this.mqttMatcher(sub.tag, tag)) {
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
  public subscribe(subscriber: ISubscriber): string {
    if (!subscriber.id) {
      subscriber.id = randomUUID();
    }

    this.config.logger?.debug(
      `creating subscription ${subscriber.id} for ${subscriber.tag}`
    );
    this.subscribers[subscriber.id] = subscriber;

    return subscriber.id;
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
  public unsubscribe(id: string) {
    this.config.logger?.debug(`removing sub for ${id}`);
    delete this.subscribers[id];
  }

  private mqttMatcher(
    filter: string,
    topic: string,
    handleSharedSubscription = false
  ) {
    const filterArray = filter.split("/");

    // handle shared subscrition
    if (
      handleSharedSubscription &&
      filterArray.length > 2 &&
      filter.startsWith("$share/")
    ) {
      filterArray.splice(0, 2);
    }

    const length = filterArray.length;
    const topicArray = topic.split("/");

    for (let i = 0; i < length; ++i) {
      const left = filterArray[i];
      const right = topicArray[i];
      if (left === "#") return topicArray.length >= length - 1;
      if (left !== "+" && left !== right) return false;
    }

    return length === topicArray.length;
  }
}
