import { task } from 'ember-concurrency';
import { Task } from 'ember-concurrency/-task-property';

let concatTasks = task(function* (...items) {
  let lastValue;
  for(let i=0; i<items.length; i++) {
    let task = items[i];
    if (task instanceof Task) {
      lastValue = yield task.perform(lastValue);
    } else {
      lastValue = yield task;
    }
  }
});

export { concatTasks };