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
    uusername = models.CharField(db_column='uUsername', unique=True, max_length=24)
    upassword = models.CharField(db_column='uPassword', max_length=128)
    uemail = models.CharField(db_column='uEmail', max_length=32, unique=True)
    ufname = models.CharField(db_column='uFName', max_length=16, default="")
    ulname = models.CharField(db_column='uLName', max_length=16, default="")
    uregdate = models.DateTimeField(db_column='uRegDate', default="")
    uprofilepic = models.CharField(db_column='uProfilePic', max_length=100, default="")
    uprofilebgpic = models.CharField(db_column='uProfileBgPic', max_length=100, default="")
    udesc = models.CharField(db_column='uDesc', max_length=100, default="") 
    uip = models.CharField(db_column='uIp', max_length=16, default="") 
    ucids = ArrayField(models.IntegerField(), db_column='ucIDs', default=list) 
    uIs42 = models.BooleanField(db_column='uIs42', default=False)
    matchesplayed = models.IntegerField(db_column='MatchesPlayed', default=0)
    matcheswon = models.IntegerField(db_column='MatchesWon', default=0)  
    matcheslost = models.IntegerField(db_column='MatchesLost', default=0)  
    xp = models.IntegerField(db_column='XP', default=0) 
    rank = models.IntegerField(db_column='Rank', default=1)
    level = models.IntegerField(db_column='level', default=0)
    utitle = models.CharField(db_column='uTitle', max_length=16, default="")
    udiscordid = models.CharField(db_column='uDiscordID', max_length=16, default="")
    utournamentsplayed = models.IntegerField(db_column='uTournamentsPlayed', default=0)
    utournamentswon = models.IntegerField(db_column='uTournamentsWon', default=0)
    utournamentslost = models.IntegerField(db_column='uTournamentsLost', default=0)
    ABlocked = ArrayField(models.IntegerField(), db_column='ABlocked', default=list)
    ABlockedBy = ArrayField(models.IntegerField(), db_column='ABlockedBy', default=list)
    Afriends = ArrayField(models.IntegerField(), db_column='AFriends', default=list)
    ARequests = ArrayField(models.IntegerField(), db_column='ARequests', default=list)
    TwoFactor = models.BooleanField(db_column='TwoFactor', default=False)
    isOnline = models.BooleanField(db_column='online', default=False)

class UsersAdmin(ModelAdmin):
    list_display = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']
    search_fields = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']
    
    
class MatchHistory(models.Model):
    id = models.AutoField(primary_key=True)
    matchtype = models.CharField(db_column='MatchType', max_length=8, default="")
    fOpponent = models.IntegerField(db_column='fOpponent', default=-1)
    sOpponent = models.IntegerField(db_column='sOpponent', default=-1)
    tOpponent = models.IntegerField(db_column='tOpponent', default=-1)
    lOpponent = models.IntegerField(db_column='lOpponent', default=-1)
    mStartDate = models.DateTimeField(db_column='mStartDate', default="")
    Score = ArrayField(models.IntegerField(), db_column='Score')
    Winners = ArrayField(models.IntegerField(), db_column='Winners')
    
    def __str__(self):
        return ("Match ID" + str(self.id) + 
                "\nFirst OP" + str(self.fOpponent) + 
                "\nSecond OP" + str(self.sOpponent) + 
                "\nThird OP" + str(self.tOpponent) + 
                "\nFourth OP" + str(self.lOpponent) + 
                "\nMatch Date" + str(self.mStartDate) + 
                "\nScore " + str(self.Score) + 
                "\nWinner IDs " + str(self.Winners) + "\n-----------------------------------")
    
class MatchHistoryAdmin(ModelAdmin):
    list_display = ['fOpponent', 'sOpponent', 'tOpponent', 'lOpponent', 'mStartDate', 'Score', 'Winners']
    search_fields = ['fOpponent', 'sOpponent', 'tOpponent', 'lOpponent', 'mStartDate', 'Score', 'Winners']
    