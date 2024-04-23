#!/bin/sh

parse_args() {
    if [ $# -eq 0 ]
    then
        echo "USAGE: DjangoSetup.sh <Project Name> <Project App Name> <superuser name> <superuser password> <email> <database>"
        return 1
    fi
    if [ -z $1 ] || [ -z $2 ] || [ -z $3 ] || [ -z $4 ] || [ -z $5 ] || [ -z $6 ]
    then
        echo "One or more Positional arguments is/are undefined."
        return 1
    fi

}

create_project() {
    if [ -z $1 ] || [ -z $2 ]
    then
        echo "Project Name is empty"
        exit 1
    fi
    echo "Starting a Project"
    django-admin startproject $1 $2
    if [ $? -eq 1 ]
    then
        echo "Failed to Create the project, check if django and python are installed"
        exit 1
    fi
}

create_app() {
    if [ -z $1 ] || [ -z $2 ] || [ -z $3 ]
    then
        echo "One of the arguments is empty"
        exit 1
    fi
    echo "Creating App with name: $1"
    cd /VolumeData/
    python3 ./manage.py startapp $1
    result=$?
    if [ $result -eq 1 ]
    then
        echo "Failed to create the app. Check if the path is correct."
        exit 1
    else
        echo "App created successfully with exit code: $result"
    fi
}

create_superuser() {
    local output exitcode
    if [ -z $1 ] || [ -z $2 ] || [ -z $3 ] || [ -z $4 ] || [ -z $5 ]
    then
        echo "One of the arguments is empty"
        exit 1
    fi
    echo "Creating a Superuser"
    python3 $5/manage.py shell < /Toolkit/PythonSuperUserCheck.py
}

check_project_setup() {
    if [ -d "$1/$2" ] && [ -d "$1/$2/$3" ]
    then
        echo "Installation has succeeded"
    else
        echo "Installation hasn't succeeded"
    fi 
}

migrate_defaults() {
    if [ -z $1 ]
    then
        echo "One of the arguments is empty"
        exit 1
    fi
    echo "Migrating Objects"
    python3 $1/manage.py migrate
    if [ $? -eq 1 ]
    then
        echo "Migrating Failed."
        exit 1
    fi
}

configure_database() {
    if [ -z $1 ] ||  [ -z $2 ]
    then
        echo "One of the arguments is empty"
        exit 1
    fi
    echo "Setting the configuration up..."
    cp -pf /Toolkit/settings.py $1/$2/settings.py
}

initiate_django() {
    parse_args $@
    if [ $? -eq 1 ]
    then
        exit 1
    fi
    local pName pApp pSName pSPass pEmail pDb path
    pName=$1
    pApp=$2
    pSName=$3
    pSPass=$4
    pEmail=$5
    pDb=$6
    path="/VolumeData"

    echo "Creating Django Project, Please Wait..."
    create_project $pName $path
    configure_database $path $pName
    migrate_defaults $path
    create_superuser $pSName $pSPass $pEmail $pDb $path
    create_app $pApp $path $pName
    check_project_setup $path $pName
}

if [ -z $SETUP_DONE ] || [ $SETUP_DONE -eq 0 ]
then
    initiate_django $PROJECT_NAME $PROJECT_APP $SU_NAME $SU_PASS $SU_EMAIL $RP_DB
fi