import * as os from "os";
import { state } from "./modules/local";

interface ISaltLogFormat {
  [key: string]: {
    minion: string;
    state: string;
    comment?: string;
  }[];
}

/**
 * Helper class for performing various tasks on the result of the state functions
 */
export class StateResponseHelper {
  response: state.IStateHighStateResponse;

  constructor(response: state.IStateHighStateResponse) {
    this.response = response;
  }

  /**
   * @returns The number of responses from salt minions
   */
  public responses(): number {
    return Object.keys(this.response).length;
  }

  public successes(): number {
    let count = 0;
    for (const minion of Object.keys(this.response)) {
      for (const taskId of Object.keys(this.response[minion])) {
        const r = this.response[minion][taskId];
        if (r.result) {
          count += 1;
        }
      }
    }

    return count;
  }

  public failures(): number {
    let count = 0;
    for (const minion of Object.keys(this.response)) {
      for (const taskId of Object.keys(this.response[minion])) {
        const r = this.response[minion][taskId];
        if (!r.result) {
          count += 1;
        }
      }
    }

    return count;
  }

  /**
   * @returns The salt output in a human readable text format similar to Ansible
   */
  public toTextLog(): string {
    const saltLogFormat: ISaltLogFormat = {};
    const saltLogOutput: string[] = [];

    for (const minion of Object.keys(this.response)) {
      for (const taskId of Object.keys(this.response[minion])) {
        const s = this.response[minion][taskId];

        let state = "unknown";
        // state can be changed, ok or fatal
        if (Object.keys(s.changes!).length > 0) {
          state = "changed";
        } else if (s.result === true) {
          state = "ok";
        } else if (s.result === false) {
          state = "fail";
        }

        if (!(s.__id__! in saltLogFormat)) {
          saltLogFormat[s.__id__!] = [];
        }

        saltLogFormat[s.__id__!].push({
          minion,
          comment: s.comment,
          state,
        });
      }
    }

    for (const taskId of Object.keys(saltLogFormat)) {
      const task = saltLogFormat[taskId];

      saltLogOutput.push(`TASK [${taskId}]`);

      for (const t of task) {
        if (t.state === "fail") {
          saltLogOutput.push(`${t.state}: [${t.minion}] ${t.comment}`);
        } else {
          saltLogOutput.push(`${t.state}: [${t.minion}]`);
        }
      }

      saltLogOutput.push("");
    }

    return saltLogOutput.join(os.EOL);
  }
}
