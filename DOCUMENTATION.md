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

## 2 - PostgreSQL Connection to the Database

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

For example imagine there's 2 Microservices:

* Auth
* Profile

1. The **Client** will send a request to the **Profile** **Microservice** in order to get his profile information by sending his token (cookies or JWTs).
2. The **Profile** **Microservice** will send a request to **Auth Microservice**, Relaying the token acquired from the **Client** for it to be verified and serve the client the content he requested.
3. After the verification is done and is valid, The **Auth Microservice** will confirm it by regenerating a new token for the **Client** with a new expiry date, and sends it back to the **Profile Microservice**
4. The **Profile Microservice** will generate the requested data and sends it back to the **Client.**

Below you'll find some diagrams showing communication between The Microservices mentioned:

![img](https://i.imgur.com/tMXO45L.png)

![img](https://i.imgur.com/DgooOcK.png)

## 5 - Connecting to the Database between multiple microservices

RetroPong's Infrastructure is based on microservices which run django inside to provide compatibility and ease of use/debug, one of the many features provided by Django's ORM is the ability for two Microservices to connect to an existing table without the need to configure anything:

To start connecting your django instance (Microservice) to the database you need to do the following:

**(Assuming you already configured Database Connection inside settings.py)**

1. Run Django's inspectdb command to retrieve the database layout from postgres server:

   ```shell
   $ ./manage inspectdb > models.py
   ```

   1. What inspectdb does is to inspect the database for any existing tables and then make classes for them and their columns with appropriate types for each column.
2. After you get the models.py file from the command without errors, copy the newly created models.py file to the desired **APP** inside your **Microservice**.
3. You should have this class inside any of the tables in your **models.py** that class is the one responsible for providing metadata about the table:

   ```python
       class Meta:
           db_table = 'YOUR DESIRED TABLE'
   	managed = False
   ```

   1. `db_table` is an identifier that links your **Class** to your **Table** using the name of your table in the database to find it and link it.
   2. `managed` is a trigger that controls whether **Django's ORM** should preform any Creation/Deletion Operation on your existing table, `False` means **Django's ORM**  will not preform the previously mentioned operations on that db and will treat it as an existing table. I prefer not to mess with this option and do it the classic way.
   3. It's recommended to delete the `managed` option inside the `Meta` class.
4. Delete any Tables that are not related to your **Microservice**
5. Since Django thinks that the Tables generated inside models.py are new and with no migrations before, It will try to create it again and you will certainly get an error. To fix this issue just run the following command:

   ```shell
   $ ./manage.py makemigrations
   $ ./manage.py migrate --fake
   ```

   1. The above commands will make the migrations for the tables, so django identifies which tables to interact with and the second to commit those tables. `--fake` parameter insures that the migration to the db is faked and no data inside the db is affected and also to stop django from trying to create an already existing table.
6. Correct any missing information inside each of tables properties, `default` argument will be very useful when you use it to tweak the default value for each property (use `-1` for integer values and `""` for strings, Lastly use  `False` for booleans)
7. Once all is done, check if the connection is successful with the command:

   ```shell
   $ ./manage.py runserver
   ```
8. If no errors happen, you have successfully connected the **Microservice** to the existing **Table.**

## 6 - Requesting Authorization from the Auth Microservice
- By default all microservices should request authorization whenever a client tries to access a service or connects through websockets.
- RetroPong's **Auth Microservice** support authorization through one of it's endpoints.
- When a user signs in the Auth Microservice generates a **JWT** and assigns it to that user, this operation is stateless which means the auth microservice will not store any information regarding the connection/session. The lifetime of the token is about 7 days.
### Authorizing the service in Backend:
- To request authorization you'll need **requests** python module.
- Send a request to this endpoint:
	- `http://127.0.0.1:8000/auth`
	-  Make sure to include `Authorization` header in the request.
	- The Full header should look like: `Authorization: Bearer JWT-TOKEN-HERE`
	- you'll recieve a response with one of 3 status codes:
		- 200 - OK, this means that the jwt token is valid, you'll recieve in the body of the response the jwt token alongside the id associated with it.
		- 400 - Bad Request, this means that you forgot to include Authorization header inside the request headers or it's value.
		- 401 - Unauthorized, this means that the token is invalid or has expired, return 401 to the user.
### Acquiring JWT from Cookies:
- RetroPong's JWT is stored as a cookie with the name `access`, you should implement a js function that returns the value of the cookie. 
- In the latest commit of the Prod branch you're gonna find a function called `getCookie` already implemented, just use it to get the JWT.
- Once you've acquired the JWT, send it with any fetch request or Websocket connection. (in fetch requests make sure to include `Authorization` the headers).
