const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub({
  projectId: process.env.GCP_PROJECT
});

const TOPIC_NAME = process.env.PUB_SUB_TOPIC;

async function handleEvent(requestBody) {
  if (requestBody.event) {
    if (requestBody.event.type === 'app_mention'
      && requestBody.event.text) {
      await publishEvent('bot-event', requestBody);
    }

    if (requestBody.event.type === 'message'
      && requestBody.event.subtype === undefined
      && requestBody.event.channel_type === 'im'
      && requestBody.event.text) {
      await publishEvent('bot-event', requestBody);
    }
  }
}

async function handleInteractive(requestBody) {
  if (requestBody) {
    await publishEvent('internactive-event', requestBody);
  }
}


async function handleAuthN(payload) {
  if (payload) {
    await publishEvent('authn-event', payload);
  }
}

async function publishEvent(eventName, payload) {
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  const customAttributes = {
    eventName,
    origin: 'slack-bot'
  };

  const messageId = await pubsub
    .topic(TOPIC_NAME)
    .publish(dataBuffer, customAttributes);
  console.info(`Message ${messageId} published.`);

  // to prevent user click on buttons again.
  await sleep(500);
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = {
  handleAuthN,
  handleInteractive,
  handleEvent
};
