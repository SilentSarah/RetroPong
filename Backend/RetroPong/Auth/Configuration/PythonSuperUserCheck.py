from django.contrib.auth.models import User
import os

def CreateSuperUser():
    User.objects.create_superuser(
            username=os.environ.get("SU_NAME"), 
            email=os.environ.get("SU_EMAIL"), 
            password=os.environ.get("SU_PASS"))
    print('Admin user has been created.')
    exit(1)

try:
    if User.objects.count() == 0:
       CreateSuperUser()
    else:
        User.objects.filter(username=os.environ.get("SU_NAME")).delete()
        CreateSuperUser()
        print('Found Admin with same name, deleting and creating new one.')
except Exception as e:
    print('Error creating admin user.')
    exit(1)