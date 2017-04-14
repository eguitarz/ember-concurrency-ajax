import { task } from 'ember-concurrency';
import Ember from 'ember';

const { $, assert, isEmpty, Service } = Ember;
const DEFAULT_TASK = '__default';

let _createTask = function ({ policy, maxConcurrency }) {
  let _task = task(function *() {
    let xhr = $.ajax(...arguments);

    try {
      yield xhr.promise();
    } finally {
      xhr.abort();
    }

    return xhr;
  });
  
  _task = policy ? _task[policy]() : _task;
  _task = maxConcurrency ? _task.maxConcurrency(maxConcurrency) : _task;

  return _task;
};

let _ajaxOptions = function(options) {
  options = Object.create(options);
  delete options.name;
  delete options.policy;
  delete options.maxConcurrency;
  return options;
};

export default Service.extend({
  tasks: {},

  _registerTask(name, task) {
    this.set(`tasks.${name}`, task);
  },

  init() {
    this._super(...arguments);
    this.createTask({ name: DEFAULT_TASK, maxConcurrency: Infinity });
  },

  request(url, options={}, name) {
    assert('first parameter in request has to be URL string', 'string' === typeof url);

    let task = this.task(name || DEFAULT_TASK);
    assert('task is not existing, you might want to create the task.', task);

    return task.perform(url, _ajaxOptions(options));
  },

  task(name) {
    assert('task name cannot be empty', !isEmpty(name));
    return this.get(`tasks.${name}`);
  },

  createTask({ name, policy, maxConcurrency }) {
    assert('option should contain "name" as a string', 'string' === typeof name);
    assert(`task ${name} is already existing`, !this.task(name));
    let task = _createTask({ policy, maxConcurrency });
    this._registerTask(name, task);
  }
});