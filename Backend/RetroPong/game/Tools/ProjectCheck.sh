#************************************#
#   Author:     Sarah Meftah         #
#   Date:       20/03/2024           #
#   Version:    1.0                  #
#   Purpose:    Project Healthcheck  #
#************************************#

source  /Toolkit/DjangoSetup.sh

check_project_availability() {
    if [ -d "/VolumeData/$PROJECT_NAME" ]
    then
        echo "$PROJECT_NAME is available"
        if [ -d "/VolumeData/$PROJECT_APP" ]
        then
            echo "$PROJECT_APP is available"
        else
            echo "$PROJECT_APP isn't available creating..."
            create_app $PROJECT_APP "/VolumeData/$PROJECT_NAME" $PROJECT_NAME
        fi
    else
        echo "Project isn't installed creating..."
        initiate_django $PROJECT_NAME $PROJECT_APP $SU_NAME $SU_PASS $SU_EMAIL $RP_DB
    fi
}
if [ $SETUP_DONE -eq 1 ]
then
    check_project_availability
fi
exec $@