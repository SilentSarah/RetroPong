# **Environment Setup Guide for RetroPong**

## 1 - Django Virtual Environment:

Please run the following commands to initiate the virtual environment for the backend server:

```bash
cd Backend
python3 -m venv PyLibraries
```

Activate the environment using the following command

```bash
source ./PyLibraries/bin/activate
```

Run the following commands to install the necessary libraries on the virtual environment:

```bash
cd .. # goes back to the main folder
pip install -r requirements.txt
```

Once all is done go back to the RetroPong folder inside the backend and execute the following command to start the development server:

```bash
cd Backend/RetroPong
./manage.py runserver
```

## 2 - PostgreSQL Connection to the Database:

Since iMacs in 1337 have a malfunctioning version of docker a vps had to be used to host the database

The credentials will be shared in the **Docs** section on notion

For ease of access and management i recommend you to install **pgAdmin** or if you like using VSC get this extension: [DB Manager](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-postgresql-client2)

## 3 - Microservices Configuration

Retropong Backend Interface will be implemented in accordance with microservices technology, which means that each service that handles an aspect in retropong will be isolated in it's own component.

Retropong Backend Interface will be comprised of several services:

* Authentication Service
* User/Player Information and Management Service.
* Game Stats and Events Service
* Chat Service
* Tournament Service

Each Service will have it's own **Docker Container.**

Here's how to setup the environment to start:

* Install Docker and Docker Compose, if you're working in School iMacs install a virtual machine and an OS of your choice (linux probably).
* After Installation Succeeds, Install python, django and any necessary services inside the container.
* Import your Service Project inside the container
* Run the service inside the container

After you finish working on the microservice assigned to you please make to commit and to push to the appropriate branch.

## 4 - Microservice Diagram, Explanations

Microservice Architecture is a backend design in which a set of services (servers) communicate with each other in order for them to relay content, validate client requests and to minimize downtime during deployment and development.

For example imagine there's 3 Microservices:

* Auth
* Profile

1. The **Client** will send a request to the **Profile** **Microservice** in order to get his profile information by sending his token (cookies or JWTs).
2. The **Profile** **Microservice** will send a request to **Auth Microservice**, Relaying the token acquired from the **Client** for it to be verified and serve the client the content he requested.
3. After the verification is done and is valid, The **Auth Microservice** will confirm it by regenerating a new token for the **Client** with a new expiry date, and sends it back to the **Profile Microservice**
4. The **Profile Microservice** will generate the requested data and sends it back to the **Client.**

Below you'll find some diagrams showing communication between The Microservices mentioned:

![img](https://i.imgur.com/tMXO45L.png)

![img](https://i.imgur.com/DgooOcK.png)
