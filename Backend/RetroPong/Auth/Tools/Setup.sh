#!/bin/sh

install_sys_dependency() {
    echo "Installing System Dependency $1"
    apt install $1
}

check_sys_dependency() {
    apt list --installed | grep $1 > /dev/null
    if [ $? -eq 1 ]
    then
        echo "System Dependency $1 isn't installed"
        return 1
    fi
    return 0
}

check_pip_installation() {
    pip --version > /dev/null
    if [ $? -eq 0 ]
    then
        echo "pip has sucessfuly been installed."
    else
        echo "pip hasn't been installed, installing..."
        apt install python3-pip -y -f
    fi
}

check_python_package() {
    pip freeze | grep $1 > /dev/null
    if [ $? -eq 1 ]
    then
        echo "$1 is installed."
        return 0
    fi
    return 1
}

install_python_package() {
    echo "Installing $1"
    apt install python3-$1 -y -f
}

SetupDependenciesAndCommands() {

    DjangoDeps=("django" "psycopg" "djangorestframework-simplejwt")
    echo "Setup is Starting..."
    sleep 1

    install_sys_dependency "python3"
    for dep in ${DjangoDeps[@]}
    do
        install_python_package $dep
    done

    mkdir -p /VolumeData
}

SetupDependenciesAndCommands