from django.db import models
from django.contrib.admin import ModelAdmin
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    uUsername = models.CharField(db_column='uUsername', unique=True, max_length=50, default="")  # Field name made lowercase.
    uPassword = models.CharField(db_column='uPassword', max_length=128, default="")  # Field name made lowercase.
    uEmail = models.CharField(db_column='uEmail', max_length=64, default="")  # Field name made lowercase.
    uFname = models.CharField(db_column='uFName', max_length=64, default="")  # Field name made lowercase.
    uLname = models.CharField(db_column='uLName', max_length=64, default="")  # Field name made lowercase.
    uRegdate = models.DateTimeField(db_column='uRegDate', default="")  # Field name made lowercase.
    uProfilepic = models.CharField(db_column='uProfilePic', max_length=100, default="")  # Field name made lowercase.
    uProfilebgpic = models.CharField(db_column='uProfileBgPic', max_length=100, default="")  # Field name made lowercase.
    uDesc = models.CharField(db_column='uDesc', max_length=100, default="")  # Field name made lowercase.
    uIp = models.CharField(db_column='uIp', max_length=100, default="")  # Field name made lowercase.
    ucIDs = ArrayField(models.IntegerField(), db_column='ucIDs')  # Field name made lowercase.
    uIs42 = models.BooleanField(db_column='uIs42', default=False)  # Field name made lowercase.
    
    def __str__(self):
        return self.uUsername
    
    class Meta:
        db_table = 'UserDataManagement_user'

class UsersAdmin(ModelAdmin):
    list_display = ['id', 'uUsername', 'uPassword', 'uEmail', 'uFname', 'uLname', 'uRegdate', 'uProfilepic', 'uProfilebgpic', 'uDesc', 'uIp', 'ucIDs']
    search_fields = ['uUsername', 'uEmail', 'uFname', 'uLname']