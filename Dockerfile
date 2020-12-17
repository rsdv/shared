#####################################
#                                   #
#               Base                #
#                                   #
#####################################

FROM node:15-alpine AS base

RUN apk update && \
    apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

#####################################
#                                   #
#               BUILD               #
#                                   #
#####################################

FROM base AS build

ARG NPM_TOKEN

RUN mkdir -p ./src/build
WORKDIR ./src/build

COPY package*.json ./

RUN if [ -z "$NPM_TOKEN" ]; then echo "NPM_TOKEN is not SET"; exit 1; else : ; fi

RUN printf "//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n" >> .npmrc && \
    npm cache verify && \
    npm install && \
    rm -f .npmrc

COPY ./src ./src
COPY ./bin ./bin

# Remove all unwanted dependancies
# and audit the modules to check for
# any invulnerabilities, this should fail
# upon finding one...
RUN npm prune --production && \
    npm audit

#####################################
#                                   #
#            Deployment             #
#                                   #
#####################################

FROM base

ENV HOME=/usr/src/app
ENV PORT 3000

WORKDIR $HOME

COPY --from=build ./src/build/package*.json ./
COPY --from=build ./src/build/src src
COPY --from=build ./src/build/bin bin
COPY --from=build ./src/build/node_modules node_modules

USER node

EXPOSE $PORT

ENV NODE_ENV=production

CMD node bin/www.js --port $PORT
