#!/usr/bin/env sh
set -e

yarn build
cd dist
git init
git config user.name 'u/poop_sox'
git config user.email 'poop_sox@reddit'
git config core.sshCommand 'ssh -i ~/.ssh/novavax-finder'
git add -A
git commit -m 'deploy github pages'
git push -f git@github.com:novavax-finder/novavax-finder.github.io.git master:gh-pages
cd -
