from django.db import models
from django.contrib.admin import ModelAdmin
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    uusername = models.CharField(db_column='uUsername', unique=True, max_length=24)
    upassword = models.CharField(db_column='uPassword', max_length=128)
    uemail = models.CharField(db_column='uEmail', max_length=32, unique=True)
    ufname = models.CharField(db_column='uFName', max_length=16, default="")
    ulname = models.CharField(db_column='uLName', max_length=16, default="")
    uregdate = models.DateTimeField(db_column='uRegDate', default="")
    TwoFactor = models.BooleanField(db_column='TwoFactor', default=False)
    uprofilepic = models.ImageField(db_column='uProfilePic', upload_to='profile_pics/', default="/static/img/pfp/Default.png")
    uprofilebgpic = models.ImageField(db_column='uProfileBgPic', upload_to='profile_bg_pics/', default="")
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
    
    class Meta:
        managed = False
        db_table = 'UserDataManagement_user'

class UsersAdmin(ModelAdmin):
    list_display = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']
    search_fields = ['uusername', 'upassword', 'uemail', 'ufname', 'ulname' ,'uregdate', 'uprofilepic', 'uprofilebgpic', 'udesc', 'uip', 'ucids', 'uIs42', 'matchesplayed', 'matcheswon', 'matcheslost', 'xp', 'rank']
    