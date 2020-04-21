/* eslint-disable camelcase */
const mainScript = require("./package.json").main;

module.exports = {
  apps: [{
    name: "stjj.de",
    script: mainScript,
    interpreter_args: "--unhandled-rejections=strict"
  }],
  deploy: {
    production: {
      "user": "moritz",
      "host": "94.16.114.13",
      "ref": "origin/master",
      "repo": "git@github.com:moritzruth/stjj.de.git",
      "path": "/var/www/stjj.de",
      "post-deploy": [
        "nvm install --no-progress", // install the correct Node.js version
        "nvm use", // use this Node.js version
        "npm i -g yarn", // install yarn
        "yarn", // install dependencies
        "yarn build",
        "pm2 startOrRestart ecosystem.config.js --env production"
      ].join(" && ")
    }
  }
};
