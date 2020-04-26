#!/bin/bash

. ~/.nvm/nvm.sh
nvm install
nvm use

npm i -g yarn
yarn
yarn build
