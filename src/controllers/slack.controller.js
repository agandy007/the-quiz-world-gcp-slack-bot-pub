const fetch = require('node-fetch');
const {
  handleEvent,
  handleInteractive,
  handleAuthN
} = require('../services/pubsub-client.service');

const {
  REQUEST_URL_TOKEN, OAUTH_SUCCESS_REDIRECT,
  SLACK_CLIENT_ID, SLACK_CLIENT_SECRET
} = process.env;

module.exports.AuthN = (req, res, next) => {
  console.debug('Request Body ::: ', JSON.stringify(req.body));
  if (req.query.accessToken !== REQUEST_URL_TOKEN) {
    console.error('Unauthenticated request');
    res.status(401).send('Invalid accessToken.');
    return;
  }
  next();
};

module.exports.OAuthN = async (req, res) => {
  const { code } = req.query;
  const verifyResponse = await exchangVerificationCode(code);
  handleAuthN(verifyResponse);
  res.redirect(`${OAUTH_SUCCESS_REDIRECT}`);
};

module.exports.doInteractive = async (req, res) => {
  try {
    handleInteractive(req.body);
  } catch (e) {
    console.log('doInteractive:::', e);
  }
  res.end();
};

module.exports.doEventSubcription = async (req, res) => {
  if (isRequestUrlChallenge(req)) {
    res.json({
      challenge: req.body.challenge
    });
    return;
  }

  try {
    handleEvent(req.body);
  } catch (e) {
    console.warn('doEventSubcription:::', e);
  }

  res.end();
};

function isRequestUrlChallenge(req) {
  return req.method === 'POST'
      && req.body
      && req.body.type === 'url_verification';
}

async function exchangVerificationCode(code) {
  const params = new URLSearchParams();
  params.append('client_id', SLACK_CLIENT_ID);
  params.append('client_secret', SLACK_CLIENT_SECRET);
  params.append('code', code);

  return fetch('https://slack.com/api/oauth.access',
    { method: 'POST', body: params })
    .then(res => res.json());
}
