FROM ubuntu:22.04

# Update repo
RUN apt-get -y update && apt-get install -y curl

# Add user
ARG user=node

RUN adduser ${user}

ADD . /app
RUN chown -R ${user}:${user} /app
RUN mkdir -p /app/node_modules
RUN chown -R ${user}:${user} /app/node_modules/

USER ${user}

# install nvm & node
ENV NVM_DIR /home/node/.nvm
ENV NODE_VERSION 18.17.0

RUN curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o /tmp/install_nvm.sh && bash /tmp/install_nvm.sh \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app
RUN npm install

CMD ["npm", "run", "start"]
#CMD ["tail", "-f", "/dev/null"]
