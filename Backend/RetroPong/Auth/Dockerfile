FROM debian:bookworm

LABEL AUTHOR="Sarah Meftah"
LABEL INFO="Generic Microservice Container for RetroPong"
LABEL VERSION="1.0"

ARG RP_HOST
ARG RP_PORT
ARG RP_USER
ARG RP_PASS
ARG RP_DB
ARG PROJECT_NAME
ARG PROJECT_APP
ARG SU_NAME
ARG SU_PASS
ARG SU_EMAIL

ENV RP_HOST=${RP_HOST}
ENV RP_PORT=${RP_PORT}
ENV RP_USER=${RP_USER}
ENV RP_PASS=${RP_PASS}
ENV RP_DB=${RP_DB}
ENV PROJECT_NAME=${PROJECT_NAME}
ENV PROJECT_APP=${PROJECT_APP}
ENV SU_NAME=${SU_NAME}
ENV SU_PASS=${SU_PASS}
ENV SU_EMAIL=${SU_EMAIL}
ENV PYTHONUNBUFFERED=1

RUN apt update && apt upgrade
RUN apt install python3 -y -f
RUN apt install python3-django -y -f
RUN apt install python3-pip -y -f
RUN apt install libpq5 -y -f

COPY Configuration/settings.py /Toolkit/settings.py

COPY Configuration/Setup.sh /Toolkit/Setup.sh
RUN chmod +x /Toolkit/Setup.sh
RUN /Toolkit/Setup.sh

COPY Configuration/DjangoSetup.sh /Toolkit/DjangoSetup.sh
RUN chmod +x /Toolkit/DjangoSetup.sh
RUN /Toolkit/DjangoSetup.sh
ENV SETUP_DONE=1

COPY Configuration/ProjectCheck.sh /Toolkit/ProjectCheck.sh
RUN chmod +x /Toolkit/ProjectCheck.sh

ENTRYPOINT [ "bash", "/Toolkit/ProjectCheck.sh" ]
CMD [ "python3", "/VolumeData/manage.py", "runserver", "0.0.0.0:8000" ]