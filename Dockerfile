FROM ubuntu:14.04
MAINTAINER HMH
# up to date
RUN apt-get update

# install nodejs and npm
RUN apt-get install -y nodejs-legacy npm git git-core
RUN apt-get install -y curl
RUN npm install -g n
RUN n latest

#Add supervisor
RUN apt-get install supervisor -y

#Supervisor config file
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/durinsdoor.conf /etc/supervisor/conf.d/durinsdoor.conf
RUN mkdir -p /var/log/durinsdoor
##app code
RUN mkdir /durinsdoor
COPY docker/start_app.sh /durinsdoor/
RUN chmod +x /durinsdoor/start_app.sh
WORKDIR /durinsdoor
COPY . /durinsdoor/
RUN npm install
EXPOSE 3000
CMD ["/usr/bin/supervisord"]
