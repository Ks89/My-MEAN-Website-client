#!/bin/bash

#ONLY FOR Ubuntu
#DON'T EXECUTE THIS - BUT USE install.sh

read -p "Would you install npm global packages? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing npm global packages
  sudo npm install -g karma-cli
  sudo npm install -g webpack@2.2.0-rc.3
  sudo npm install -g typescript@2.0.10
  sudo npm install -g typings
  sudo npm install -g npm-check
  sudo npm install -g remap-istanbul
  sudo npm install -g webdriver-manager
  sudo npm install -g protractor
  sudo npm install -g nsp
  sudo npm install -g codeclimate-test-reporter
  sudo npm install -g istanbul
  sudo npm install -g snyk
fi

read -p "Would you update webdriver-manager to be able to use Selenium Server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo setting up a Selenium Server
  sudo webdriver-manager update
fi
