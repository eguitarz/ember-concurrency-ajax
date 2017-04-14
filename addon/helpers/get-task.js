import Ember from 'ember';

const { Helper, inject } = Ember;

export default Helper.extend({
  ecajax: inject.service(),
  compute([taskName]) {
    let ecajax = this.get('ecajax');
    return ecajax.task(taskName);
  }
});