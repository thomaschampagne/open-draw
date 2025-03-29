ARG OCI_BASE_IMAGE=alpine:3.21
ARG OCI_BASE_IMAGE_URL=https://hub.docker.com/_/alpine/
ARG OCI_TITLE="open-draw"
ARG OCI_DESCRIPTION="Virtual whiteboard for sketching hand-drawn like diagrams"
ARG OCI_MAINTAINER="Thomas Champagne"

# ========== Build Webapp ==========
FROM node:lts-alpine AS build_webapp

WORKDIR /build

COPY . .

RUN npm install -g npm@latest && \
    npm install -g pnpm@latest && \
    pnpm install && \
    pnpm run build

# ========== Build Go HTTP Static Server with embedded webapp ==========
FROM golang:1-alpine AS build_serve_bundle

WORKDIR /build

COPY serve.go .
COPY --from=build_webapp /build/dist ./dist

RUN go build -o ./open-draw serve.go

# ========== Build Runner ==========
FROM ${OCI_BASE_IMAGE} AS runner

##### NO EDIT ZONE - START #####
ARG OCI_BASE_IMAGE
ARG OCI_BASE_IMAGE_URL
ARG OCI_TITLE
ARG OCI_DESCRIPTION
ARG OCI_MAINTAINER
ARG OCI_REPO_URL
ARG OCI_BUILD_DATE

ENV OCI_BASE_IMAGE=${OCI_BASE_IMAGE}
ENV OCI_BASE_IMAGE_URL=${OCI_BASE_IMAGE_URL}
ENV OCI_TITLE=${OCI_TITLE}
ENV OCI_DESCRIPTION=${OCI_DESCRIPTION}
ENV OCI_MAINTAINER=${OCI_MAINTAINER}
ENV OCI_REPO_URL=${OCI_REPO_URL}
ENV OCI_BUILD_DATE=${OCI_BUILD_DATE}

LABEL \
    maintainer=${OCI_MAINTAINER} \
    description=${OCI_DESCRIPTION} \
    url=${OCI_REPO_URL} \
    base-image=${OCI_BASE_IMAGE} \
    base-image-url=${OCI_BASE_IMAGE_URL} \
    org.opencontainers.image.title=${OCI_TITLE} \
    org.opencontainers.image.description=${OCI_DESCRIPTION} \
    org.opencontainers.image.created=${OCI_BUILD_DATE} \
    org.opencontainers.image.authors=${OCI_MAINTAINER} \
    org.opencontainers.image.url=${OCI_REPO_URL} \
    org.opencontainers.image.base.name=${OCI_BASE_IMAGE} \
    org.opencontainers.image.base.url=${OCI_BASE_IMAGE_URL}
##### NO EDIT ZONE - END #####

#---- START IMAGE SPEC HERE ----#
ARG ALT_USER_NAME=oci
ARG ALT_USER_ID=1000

# Run upgrades
RUN apk update && apk --no-cache upgrade && \
    # Create oci user
    adduser ${ALT_USER_NAME} -u ${ALT_USER_ID} -g ${ALT_USER_NAME} -D && \
    echo "User ${ALT_USER_NAME} (id: ${ALT_USER_ID}) created"

WORKDIR /app

COPY --from=build_serve_bundle /build/open-draw .

USER ${ALT_USER_ID}

EXPOSE 3000

CMD ["/app/open-draw"]
