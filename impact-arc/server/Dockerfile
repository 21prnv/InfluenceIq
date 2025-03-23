FROM ghcr.io/puppeteer/puppeteer:24.4.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the server subdirectory
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the server code
COPY server/ .

# Start the app
CMD [ "node", "server.js" ]