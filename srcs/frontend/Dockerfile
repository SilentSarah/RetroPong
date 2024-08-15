FROM nginx:latest


ARG HOST_ADDRESS
ENV HOST_ADDRESS=${HOST_ADDRESS}

COPY ./conf/ /etc/nginx/
COPY html/ /var/www/html
COPY tools/change_host.sh /var/www/html

WORKDIR /var/www/html
RUN bash /var/www/html/change_host.sh 127.0.0.1 $HOST_ADDRESS

WORKDIR /etc/nginx/ssl/
COPY certs/c1r4p2.1337.ma.crt /etc/nginx/ssl/
COPY certs/c1r4p2.1337.ma.key /etc/nginx/ssl/


CMD ["nginx"]