# ember-concurrency-ajax

[![Build Status][build-status-img]][build-status-link]

ember-concurrency-ajax provides a service for you to manage your ajax requests. You can also trigger ajax request via helpers.

The addon is backed by [ember-concurrency](https://github.com/machty/ember-concurrency), a generator function based task scheduler.

## Usage

Send request in controllers
```
//controller.js

export default Controller.extend({
  ecajax: Ember.inject.service(),
  actions: {
    request() {
      let url = '/api/v1/foo';
      let ecajax = this.get('ecajax');

      // every request returns a TaskInstance
      let promise = ecajax.request(url);

      promise.then(data => this.set('data', data)
        .catch(error => throw 'something is wrong!'));
    }
  }
})
```

or

Send request in templates (It's working well with [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers))
```
<button onclick={{pipe
      (request '/test.json') 
      (action 'process')
    }}>
  request: default
</button> 
```

### Create Tasks
You can create task with a task name and an optional concurrency policy. [Here is the API](#).

```
import Ember from 'ember';

export default Ember.Controller.extend({
  ecajax: Ember.inject.service(),

  init() {
    this._super(...arguments);
    let ecajax = this.get('ecajax');
    ecajax.createTask({ name: 'custom', policy: 'restartable' });
  }
});
```

### Send Requests
Sending ajax is straight forward. In normal case, you don't have to worry about creating task. It has a built-in task for normal ajax requests.
```
import Ember from 'ember';

export default Ember.Controller.extend({
  ecajax: inject.service(),

  actions:{
    request() {
      let ecajax = this.get('ecajax');
      let ajaxOptions = {}; // the jquery ajax options
      
      // returns a taskInstance
      ecajax.request('/api/v1/foo', ajaxOptions);
    }
  }
});
```

### Cancel Tasks
You can use ember-concurrency's cancel-all helper to cancel your tasks. `get-task` is a helper to get the task in the service.
```
<button 
  onclick={{cancel-all (get-task 'mytask')}}>
  cancel
</button>
```

### Show Running Status
```
{{#with (get-task 'mytask') as |task|}}
  {{#if task.isRunning}}
    Loading...
  {{else}}
    task.last.value
  {{/if}}
{{/with}}
```

## API
### ecajax service
- `request(url, options, name)`
  Send ajax request.
  - url: The URL to access
  - options: settings for jQuery ajax
  - name: task name
- `task(name)`
  Get concurrency task by task name.
  - name: the task name in service
- `createTask(options)`
  create concurrency task
  - options.name: task name
  - options.policy (`optional`): concurrency policy - `restartable` `drop` `enqueue` `keepLast` or empty
  - options.maxConcurrency (`optional`): max concurrency for the task

### helpers
- `request`

Request with the URL and task name (optional), and you can pass in jQuery options as well.

```
<button onclick=(request '/api/v1/foo' options name='mytask')>
  request
</button>
```

- `get-task`

Get the task with a name in the service.

```
<button
  onclick={{cancel-all (get-task 'mytask')}}>
  cancel mytask
</button>
```


[build-status-img]: https://travis-ci.org/eguitarz/ember-concurrency-ajax.svg?branch=master
[build-status-link]: https://travis-ci.org/eguitarz/ember-concurrency-ajax