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
    uusername = models.CharField(db_column='uUsername', unique=True, max_length=50)
    upassword = models.CharField(db_column='uPassword', max_length=128)
    uemail = models.CharField(db_column='uEmail', max_length=64, unique=True, default="")
    ufname = models.CharField(db_column='uFName', max_length=64, default="")
    ulname = models.CharField(db_column='uLName', max_length=64, default="")
    uregdate = models.DateTimeField(db_column='uRegDate', default="")
    uprofilepic = models.CharField(db_column='uProfilePic', max_length=100, default="")
    uprofilebgpic = models.CharField(db_column='uProfileBgPic', max_length=100, default="")
    udesc = models.CharField(db_column='uDesc', max_length=100, default="") 
    uip = models.CharField(db_column='uIp', max_length=100, default="") 
    ucids = ArrayField(models.IntegerField(), db_column='ucIDs') 
    uIs42 = models.BooleanField(db_column='uIs42', default=False)
    matchesplayed = models.IntegerField(db_column='MatchesPlayed', default=0)
    matcheswon = models.IntegerField(db_column='MatchesWon', default=0)  
    matcheslost = models.IntegerField(db_column='MatchesLost', default=0)  
    xp = models.IntegerField(db_column='XP', default=0) 
    rank = models.IntegerField(db_column='Level', default=0)

class UsersAdmin(ModelAdmin):
    list_display = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']
    search_fields = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']