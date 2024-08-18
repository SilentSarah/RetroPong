FROM nginx:latest


ARG HOST_ADDRESS
ARG USERMGR_PORT
ARG AUTH_PORT
ARG GAME_PORT
ARG CHAT_PORT

ENV HOST_ADDRESS=${HOST_ADDRESS}
ENV USERMGR_PORT=${USERMGR_PORT}
ENV AUTH_PORT=${AUTH_PORT}
ENV GAME_PORT=${GAME_PORT}
ENV CHAT_PORT=${CHAT_PORT}

COPY ./conf/ /etc/nginx/
COPY html/ /var/www/html
COPY tools/generate_env.sh /var/www/html

RUN sed -i "s/CHANGE_ME/$HOST_ADDRESS/g" /etc/nginx/nginx.conf

WORKDIR /var/www/html
RUN bash generate_env.sh

WORKDIR /etc/nginx/ssl/
COPY certs/$HOST_ADDRESS.crt /etc/nginx/ssl/
COPY certs/$HOST_ADDRESS.key /etc/nginx/ssl/

RUN sed -i "s/c1r4p2.1337.ma/${HOST_ADDRESS}/g" /etc/nginx/nginx.conf

CMD ["nginx"]