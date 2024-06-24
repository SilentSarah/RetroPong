from django.db import models
from django.contrib.postgres.fields import ArrayField

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
        return ("The following is from the __str__ function:" +
                "\nMatch ID: " + str(self.id) + 
                "\nFirst OP: " + str(self.fOpponent) + 
                "\nSecond OP: " + str(self.sOpponent) + 
                "\nThird OP: " + str(self.tOpponent) + 
                "\nLast OP: " + str(self.lOpponent) + 
                "\nMatch Date: " + str(self.mStartDate) + 
                "\nScore: " + str(self.Score) + 
                "\nWinner IDs: " + str(self.Winners) + "\n-----------------------------------")
    
    class Meta:
        db_table = 'UserDataManagement_matchhistory'