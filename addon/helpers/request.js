import Ember from 'ember';

const { Helper, inject } = Ember;

export default Helper.extend({
  ecajax: inject.service(),
  compute([url, options], hash) {
    let ecajax = this.get('ecajax');
    return function() {
      return ecajax.request(url, options, hash.name);
    };
  }
});