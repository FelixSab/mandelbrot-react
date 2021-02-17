#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

PROJECT_NAME="$(basename $(pwd))" # Tagged by foldername
PROJECT_DIR="$(pwd)"
BUILD_IMAGE_NAME="werbezeichen/werbezeichen-cci-build:${PROJECT_NAME}"

# docker pull "${BUILD_IMAGE_NAME}"

docker build -t "${BUILD_IMAGE_NAME}" -f ./.circleci/scripts/build_image/Dockerfile .

docker run -it \
  -v "${PROJECT_DIR}:/usr/src/app" \
  -v "${HOME}/.aws:/root/.aws" \
  -p 8080:8080 \
  "${BUILD_IMAGE_NAME}" ./.circleci/scripts/development.sh
