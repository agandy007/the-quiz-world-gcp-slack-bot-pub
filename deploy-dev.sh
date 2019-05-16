#!/bin/sh

ENV=development

PROJECT_ID=the-quiz-world-dev
REGION=asia-northeast1

PUB_SUB_TOPIC=the-slack-gcp-quiz-bot-${ENV}-pub
FUNC_NAME=the-slack-gcp-quiz-bot-${ENV}-pub

echo "Deploying to project: ${PROJECT_ID}"

BUCKET_NAME=slack-bot-${ENV}-${PROJECT_ID}-cloud-fun-codebase
TIMEOUT=300
VERSION="$(date "+%Y-%m-%d-%H-%M-%S")"

gcloud config set project $PROJECT_ID

gsutil mb -c regional -l $REGION "gs://${BUCKET_NAME}"

gcloud pubsub topics create $PUB_SUB_TOPIC

gcloud functions deploy $FUNC_NAME --entry-point app --stage-bucket ${BUCKET_NAME} \
 --runtime nodejs10 --trigger-http --env-vars-file .env.${ENV}.yaml \
 --region $REGION --timeout=$TIMEOUT
