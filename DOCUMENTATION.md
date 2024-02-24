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
