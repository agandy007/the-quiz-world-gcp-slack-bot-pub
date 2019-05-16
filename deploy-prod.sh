#!/bin/sh

PROJECT_ID=the-quizz-world

echo "Deploying to project: ${PROJECT_ID}"

BUCKET_NAME=the-quizz-world-cloud-fun-codebase
REGION=asia-northeast1
TIMEOUT=300
VERSION="$(date "+%Y-%m-%d-%H-%M-%S")"

gcloud config set project $PROJECT_ID

gsutil mb -c regional -l $REGION "gs://${BUCKET_NAME}"

gcloud functions deploy slack-bot --entry-point app --stage-bucket "${BUCKET_NAME}" \
 --runtime nodejs10 --trigger-http --env-vars-file .env.yaml \
 --region $REGION --timeout $TIMEOUT
