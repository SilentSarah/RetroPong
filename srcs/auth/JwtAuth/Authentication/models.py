from django.db import models
from django.contrib.admin import ModelAdmin
from django.contrib.postgres.fields import ArrayField
import django.utils.timezone 
# Create your models here.

class Users(models.Model):
    id = models.AutoField(primary_key=True)
    uUsername = models.CharField(db_column='uUsername', unique=True, max_length=50, default="")  # Field name made lowercase.
    uPassword = models.CharField(db_column='uPassword', max_length=128, default="")  # Field name made lowercase.
    uEmail = models.CharField(db_column='uEmail', max_length=64, default="")  # Field name made lowercase.
    uFname = models.CharField(db_column='uFName', max_length=64, default="")  # Field name made lowercase.
    uLname = models.CharField(db_column='uLName', max_length=64, default="")  # Field name made lowercase.
    uRegdate = models.DateTimeField(db_column='uRegDate', default="")  # Field name made lowercase.
    uDesc = models.CharField(db_column='uDesc', max_length=100, default="")  # Field name made lowercase.
    uIp = models.CharField(db_column='uIp', max_length=100, default="")  # Field name made lowercase.
    ucIDs = ArrayField(models.IntegerField(), db_column='ucIDs')  # Field name made lowercase.
    uIs42 = models.BooleanField(db_column='uIs42', default=False)  # Field name made lowercase.
    TwoFactor = models.BooleanField(db_column='TwoFactor', default=False)  # Field name made lowercase.
    
    def __str__(self):
        return self.uUsername
    
    class Meta:
        db_table = 'UserDataManagement_user'
        managed=False

class UsersAdmin(ModelAdmin):
    list_display = ['id', 'uUsername', 'uPassword', 'uEmail', 'uFname', 'uLname', 'uRegdate', 'uDesc', 'uIp', 'ucIDs']
    search_fields = ['uUsername', 'uEmail', 'uFname', 'uLname']
    
    
class TwoFactor(models.Model):
    id = models.AutoField(primary_key=True)
    secret = models.IntegerField()
    created_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.uUsername
    
    class Meta:
        db_table = 'UserDataManagement_twofactor'
        managed=False