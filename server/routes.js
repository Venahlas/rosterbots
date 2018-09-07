'use strict';

export default function(app) {

  app.use('/api/roster', require('./api/roster'));
}
