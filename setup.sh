#!/bin/bash

nvm install --no-progress
nvm use
npm i -g yarn
yarn
yarn build
