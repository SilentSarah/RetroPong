from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.admin import ModelAdmin




class User(models.Model):
    id = models.AutoField(primary_key=True)
    uUsername = models.CharField(db_column='uUsername', unique=True, max_length=50, default="")  # Field name made lowercase.
    uEmail = models.CharField(db_column='uEmail', max_length=64, default="")  # Field name made lowercase.
    uFname = models.CharField(db_column='uFName', max_length=64, default="")  # Field name made lowercase.
    uLname = models.CharField(db_column='uLName', max_length=64, default="")  # Field name made lowercase.

    AFriends = ArrayField(models.IntegerField(), db_column='AFriends', default=list)
    ARequests = ArrayField(models.IntegerField(), db_column='ARequests', default=list)
    ABlocked = ArrayField(models.IntegerField(), db_column='ABlocked', default=list)
    ABlockedBy = ArrayField(models.IntegerField(), db_column='ABlockedBy', default=list)


    uprofilepic = models.CharField(db_column='uProfilePic', max_length=100, default="")
    uprofilebgpic = models.CharField(db_column='uProfileBgPic', max_length=100, default="")
    udesc = models.CharField(db_column='uDesc', max_length=100, default="") 
    
    isOnline = models.BooleanField(db_column='online', default=False)

    class Meta:
        db_table = 'UserDataManagement_user'
        managed=True
    
    def __str__(self):
        return self.uUsername + " " + str(self.id)
         
 
class Conversation(models.Model):
    id = models.AutoField(primary_key=True)
    cName = models.CharField(db_column='cName', max_length=50, default="")  # Field name made lowercase.
    cMembers = ArrayField(models.IntegerField(), db_column='cMembers', default=list)
    cImage = models.CharField(db_column='cImage', max_length=100, default="")
    cDesc = models.CharField(db_column='cDesc', max_length=100, default="")
    cAdmin = models.IntegerField(db_column='cAdmin', default=0)
    cCreated = models.DateTimeField(db_column='cCreated', auto_now_add=True)
    cUpdated = models.DateTimeField(db_column='cUpdated', auto_now=True)
    
    def __str__(self):
        return str(self.id)

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    mContent = models.TextField(db_column='mContent', default="")
    mSender = models.IntegerField(db_column='mSender', default=0)
    mReceiver = models.IntegerField(db_column='mReceiver', default=0)
    mConversation = models.IntegerField(db_column='mConversation', default=0)
    mCreated = models.DateTimeField(db_column='mCreated', auto_now_add=True)
    mUpdated = models.DateTimeField(db_column='mUpdated', auto_now=True)
    mRead = models.BooleanField(db_column='mRead', default=False)

    def __str__(self):
        return str(self.id)


class Invitation(models.Model):
    id = models.AutoField(primary_key=True)
    iSender = models.IntegerField(db_column='iSender', default=0)
    iReceiver = models.IntegerField(db_column='iReceiver', default=0)
    iCreated = models.DateTimeField(db_column='iCreated', auto_now_add=True)
    iUpdated = models.DateTimeField(db_column='iUpdated', auto_now=True)
    iRead = models.BooleanField(db_column='iRead', default=False)
    iStatus = models.CharField(db_column='iStatus', max_length=50, default="pending")

    def __str__(self):
        return str(self.id)



class Channel(models.Model):
    chID = models.AutoField(primary_key=True)
    chName = models.CharField(db_column='chName', max_length=50, default="")  # Field name made lowercase.
    chMembers = ArrayField(models.IntegerField(), db_column='chMembers', default=list)
    chDesc = models.CharField(db_column='chDesc', max_length=100, default="")
    chAdmin = models.IntegerField(db_column='chAdmin', default=0)
    chCreated = models.DateTimeField(db_column='chCreated', auto_now_add=True)
    chUpdated = models.DateTimeField(db_column='chUpdated', auto_now=True)

    
    def __str__(self):
        return self.chName

class ChannelMessage(models.Model):
    id = models.AutoField(primary_key=True)
    chID = models.IntegerField(db_column='chID', default=0)
    cmContent = models.TextField(db_column='cmContent', default="")
    cmSender = models.IntegerField(db_column='cmSender', default=0)
    cmCreated = models.DateTimeField(db_column='cmCreated', auto_now_add=True)
    cmUpdated = models.DateTimeField(db_column='cmUpdated', auto_now=True)
    cmRead = models.BooleanField(db_column='cmRead', default=False)

    def __str__(self):
        return str(self.id)