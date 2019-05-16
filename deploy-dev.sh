#!/bin/sh

ENV=development

PROJECT_ID=the-quiz-world-dev
REGION=asia-northeast1

PUB_TOPIC=the-quiz-bot-slack-pub

echo "Deploying to project: ${PROJECT_ID}"

BUCKET_NAME=slack-bot-${ENV}-${PROJECT_ID}-cloud-fun-codebase
TIMEOUT=300
VERSION="$(date "+%Y-%m-%d-%H-%M-%S")"

gcloud config set project $PROJECT_ID

gsutil mb -c regional -l $REGION "gs://${BUCKET_NAME}"

gcloud pubsub topics create $PUB_TOPIC

gcloud functions deploy slack-bot-${ENV} --entry-point app --stage-bucket ${BUCKET_NAME} \
 --runtime nodejs10 --trigger-http --env-vars-file .env.${ENV}.yaml \
 --region $REGION --timeout=$TIMEOUT
