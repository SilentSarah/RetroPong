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

WORKDIR /var/www/html
RUN bash generate_env.sh

WORKDIR /etc/nginx/ssl/
COPY certs/c1r4p2.1337.ma.crt /etc/nginx/ssl/
COPY certs/c1r4p2.1337.ma.key /etc/nginx/ssl/

RUN mv c1r4p2.1337.ma.crt ${HOST_ADDRESS}.crt
RUN mv c1r4p2.1337.ma.key ${HOST_ADDRESS}.key
RUN sed -i "s/c1r4p2.1337.ma/${HOST_ADDRESS}/g" /etc/nginx/nginx.conf

CMD ["nginx"]