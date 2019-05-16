const routers = require('express').Router();

const {
  AuthN, OAuthN,
  doEventSubcription, doInteractive
} = require('../controllers/slack.controller');

routers.use(AuthN);

routers.get('/slack-oauth', OAuthN);

routers.use('/interactive-components', doInteractive);
routers.use('/event-subscriptions', doEventSubcription);

module.exports = routers;
