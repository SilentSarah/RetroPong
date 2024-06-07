from ..models import *
import bcrypt
from django.utils import timezone
from django.db.models import Q
import datetime
import requests
from requests.models import Response
import re
from django.core.files.base import ContentFile
from django.contrib.sites.models import Site
from django.utils.datastructures import MultiValueDict
from django.core.files.uploadedfile import UploadedFile

DEFAULT_PFP_LINK = "https://i.ibb.co/3pWy5cD/Default.png"
DEFAULT_BG_LINK = "https://i.ibb.co/yg3Z2dy/Default-BG.png"

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
                i += 1
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
            domain = Site.objects.get_current().domain
            user = {
                "id": user.id,
                "username": user.uusername,
                "password": user.upassword,
                "email": user.uemail,
                "fname": user.ufname,
                "lname": user.ulname,
                "regdate": user.uregdate,
                "profilepic": 'http://{}{}'.format(domain, user.uprofilepic.url if user.uprofilepic != "/static/img/pfp/Default.png" else "/static/img/pfp/Default.png") ,
                "profilebgpic": 'http://{}{}'.format(domain, user.uprofilebgpic.url if user.uprofilebgpic != "/static/img/pfp/DefaultBG.png" else "/static/img/pfp/DefaultBG.png") ,
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
                "matchstatistics": DbOps.generate_match_statistics(user.id),
                "two_factor": user.TwoFactor,                
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
            user.uprofilepic.delete()
            user.uprofilebgpic.delete()
            user.delete()
            return True
        except User.DoesNotExist:
            return False
    
    @staticmethod
    def update_user(user_id: int, new_data: dict, uploaded_files: MultiValueDict[str, UploadedFile]) -> bool:
        """Updates user data in the database

        Args:
            user_id (int): user id of the user to be updated
            new_data (dict): new data to be updated in dictionary format

        Returns:
            bool: True if user is updated, False if user does not exist or update fails
        """
        try:
            user = User.objects.get(id=user_id)
            pfp_uploaded = uploaded_files.get('pfp')
            bg_uploaded = uploaded_files.get('bg')
            for key, value in new_data.items():
                if (value == None or value == ""):
                    continue
                setattr(user, key, value)
            if (uploaded_files is not None):
                if (pfp_uploaded is not None):
                    user.uprofilepic.delete()
                    user.uprofilepic.save(f"{user.uusername + pfp_uploaded.name}", pfp_uploaded)
                if (bg_uploaded is not None):
                    user.uprofilebgpic.delete()
                    user.uprofilebgpic.save(f"{user.uusername + bg_uploaded.name}", bg_uploaded)
            notification = Notification(
                nType="ACCOUNT",
                nContent="Your account settings has been updated",
                nReciever=user_id,
                nSender=user_id,
                nDate=datetime.datetime.now(tz=timezone.utc)
            )
            notification.save()
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
        pfp_url = user_data_copy.get('uProfilepic')
        bg_url = user_data_copy.get('uProfilebgpic')
        pfp_response = requests.get(DEFAULT_PFP_LINK) if pfp_url is None else requests.get(pfp_url)
        bg_response = requests.get(DEFAULT_BG_LINK) if bg_url is None else requests.get(bg_url)

        new_user = User(
            uusername=user_data_copy.get('uUsername'),
            upassword=user_data_copy.get('uPassword'),
            uemail=user_data_copy.get('uEmail'),
            ufname=user_data_copy.get('uFname'),
            ulname=user_data_copy.get('uLname'),
            uregdate=datetime.datetime.now(tz=timezone.utc),
            uIs42=False if is42 == 0 else True
        )


        new_user.uprofilepic.save(f"{user_data_copy.get('uUsername')}.jpg", ContentFile(pfp_response.content)) if pfp_response is not None and type(pfp_response) is Response else None
        new_user.uprofilebgpic.save(f"{user_data_copy.get('uUsername')}_bg.jpg", ContentFile(bg_response.content)) if bg_response is not None and type(bg_response) is Response else None

        new_user.save()
        return True # I NEED TO SET THIS BACK TO TRUE AND UNCOMMENT THE ABOVE LINE
    @staticmethod
    def get_notifications(user_id: int, last_notification_id: int = -1) -> dict[str]:
        """Retrieves notifications from the database

        Args:
            user_id (int): user id of the user to be retrieved

        Returns:
            dict: Notifications in dictionary format
        """
        try:
            i: int = 1
            notifications = Notification.objects.filter(nReciever=user_id).order_by('-id')[0:5]
            notifications_list = {
                "Notifications": {},
            }
            for notification in notifications:
                sender = User.objects.get(id=notification.nSender)
                if (sender is not None):
                    sender_pfp = 'http://{}{}'.format(Site.objects.get_current().domain, sender.uprofilepic.url)
                    sender_username = sender.uusername
                if (notification.id <= last_notification_id):
                    continue
                notifications_list["Notifications"][i] = {
                    "id": notification.id,
                    "type": notification.nType,
                    "content": notification.nContent,
                    "date": datetime.datetime.strftime(notification.nDate, "%d/%m/%Y %H:%M:%S"),
                    "reciever": notification.nReciever,
                    "sender": notification.nSender,
                    "sender_username": sender_username,
                    "sender_pfp": sender_pfp,
                }
                i += 1
            return notifications_list
        except Exception as e:
            print("DbOps: ", e)
            return None