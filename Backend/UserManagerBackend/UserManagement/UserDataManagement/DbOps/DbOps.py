from ..models import *
import bcrypt
from django.utils import timezone
from django.db.models import Q
import datetime
import re

class DbOps:
    def __init__(self):
        pass

    @staticmethod
    def generate_match_history(id: int) -> dict:
        try:
            matches = MatchHistory.objects.filter(Q(fOpponent=id) | Q(sOpponent=id) | Q(tOpponent=id) | Q(lOpponent=id)).filter(matchtype="solo").order_by('-mStartDate')[:3]
            if (matches is None):
                return {}
            match_history = {}
            for round in matches:
                opponent = round.fOpponent if round.fOpponent != id and round.fOpponent != -1 else round.sOpponent
                opponent = User.objects.get(id=opponent)
                match_history[round.id] = {
                    "OpponentData": {
                        "id": opponent.id,
                        "pfp": opponent.uprofilepic,
                        "username": opponent.uusername,
                        "score": round.Score,
                        "result": "WIN" if id in round.Winners else "LOSS" if opponent.id in round.Winners else "DRAW" if opponent.id in round.Winners and id in round.Winners else "DRAW",
                    }
                }
            return match_history
        except Exception as e:
            print("DbOps: ", e)
            return None
        
    @staticmethod
    def generate_match_statistics(id: int) -> dict:
        try:
            today = datetime.datetime.now(tz=timezone.utc)
            matches = MatchHistory.objects.filter(Q(fOpponent=id) | Q(sOpponent=id) | Q(tOpponent=id) | Q(lOpponent=id)).filter(matchtype="solo").order_by('-mStartDate')
            if (matches is None):
                return {}
            four_day_matches = []
            for i in range(4):
                four_day_matches.append(matches.filter(mStartDate__range=[today - datetime.timedelta(days=i), today - datetime.timedelta(days=i-1)]))
            matches_played = {
                "Matches Played": {},
            }
            i = 0
            for day_matches in four_day_matches:
                date = (today - datetime.timedelta(days=i)).strftime('%d/%m')
                match_count = day_matches.count()
                matches_played["Matches Played"][date] = match_count
                i += 1;
            return matches_played
        except Exception as e:
            print("DbOps: ", e)
            return None

    @staticmethod
    def get_user(user_id: int = -1, username: str = None) -> dict:
        """Retrieves userdata from the database

        Args:
            user_id (int): user id of the user to be retrieved

        Returns:
            User: Database User Object
        """
        try:
            if (username is not None):
                user = User.objects.get(uusername=username)
            else:
                user = User.objects.get(id=user_id)
            user = {
                "id": user.id,
                "username": user.uusername,
                "password": user.upassword,
                "email": user.uemail,
                "fname": user.ufname,
                "lname": user.ulname,
                "regdate": user.uregdate,
                "profilepic": user.uprofilepic,
                "profilebgpic": user.uprofilebgpic,
                "desc": user.udesc,
                "ucids": user.ucids,
                "is42": user.uIs42,
                "matchesplayed": user.matchesplayed,
                "matcheswon": user.matcheswon,
                "matcheslost": user.matcheslost,
                "xp": user.xp,
                "rank": user.rank,
                "level": user.level,
                "title": user.utitle,
                "discordid": user.udiscordid,
                "tournamentsplayed": user.utournamentsplayed,
                "tournamentswon": user.utournamentswon,
                "tournamentslost": user.utournamentslost,
                "matchhistory": DbOps.generate_match_history(user.id),
                "matchstatistics": DbOps.generate_match_statistics(user.id)
                
            }
            return user
        except User.DoesNotExist:
            user = None
        return user
    
    @staticmethod
    def delete_user(user_id: int) -> bool:
        """Deletes a user from the database

        Args:
            user_id (int): user id of the user to be deleted

        Returns:
            bool: True if user is deleted, False if user does not exist or deletion fails
        """
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return True
        except User.DoesNotExist:
            return False
    
    @staticmethod
    def update_user(user_id: int, new_data: dict) -> bool:
        """Updates user data in the database

        Args:
            user_id (int): user id of the user to be updated
            new_data (dict): new data to be updated in dictionary format

        Returns:
            bool: True if user is updated, False if user does not exist or update fails
        """
        try:
            user = User.objects.get(id=user_id)
            for key, value in new_data.items():
                setattr(user, key, value)
            user.save()
            return True
        except Exception as e:
            print("DbOps: ",e)
            return False
        
    @staticmethod 
    def create_user(user_data: dict, is42: int = 0) -> bool:
        """Creates a new user in the database

        Args:
            user_data (dict): user data in dictionary format

        Returns:
            bool: True if user is created, False if creation fails
        """
        user_data_copy = user_data.copy()
        unhashed_password = str(user_data_copy.get("uPassword"))
        if (re.match(r'[A-Za-z0-9]{8,}', unhashed_password) is None):
            return False
        hashed_password = str(bcrypt.hashpw(unhashed_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))
        user_data_copy.update(
            {
                "uPassword": hashed_password
            })
        pfp = user_data_copy.get('uProfilepic')
        bg = user_data_copy.get('uProfilebgpic')
        User.objects.create(
            uusername=user_data_copy.get('uUsername'),
            upassword=user_data_copy.get('uPassword'),
            uemail=user_data_copy.get('uEmail'),
            ufname=user_data_copy.get('uFname'),
            ulname=user_data_copy.get('uLname'),
            uregdate=timezone.now(),
            uprofilepic=pfp if pfp is not None else "",
            uprofilebgpic=bg if bg is not None else "",
            uIs42=False if is42 == 0 else True ,
        )
        return True