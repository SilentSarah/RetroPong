# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.admin import ModelAdmin
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    id = models.AutoField(primary_key=True)
    uusername = models.CharField(db_column='uUsername', unique=True, max_length=50)  # Field name made lowercase.
    upassword = models.CharField(db_column='uPassword', max_length=128)  # Field name made lowercase.
    uemail = models.CharField(db_column='uEmail', max_length=64, unique=True, default="")  # Field name made lowercase.
    ufname = models.CharField(db_column='uFName', max_length=64, default="")  # Field name made lowercase.
    ulname = models.CharField(db_column='uLName', max_length=64, default="")  # Field name made lowercase.
    uregdate = models.DateTimeField(db_column='uRegDate', default="")  # Field name made lowercase.
    uprofilepic = models.CharField(db_column='uProfilePic', max_length=100, default="")  # Field name made lowercase.
    uprofilebgpic = models.CharField(db_column='uProfileBgPic', max_length=100, default="")  # Field name made lowercase.
    udesc = models.CharField(db_column='uDesc', max_length=100, default="")  # Field name made lowercase.
    uip = models.CharField(db_column='uIp', max_length=100, default="")  # Field name made lowercase.
    ucids = ArrayField(models.IntegerField(), db_column='ucIDs')  # Field name made lowercase.
    uIs42 = models.BooleanField(db_column='uIs42', default=False)  # Field name made lowercase.

class UsersAdmin(ModelAdmin):
    list_display = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids']
    search_fields = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids']