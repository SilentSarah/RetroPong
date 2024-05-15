from ..models import *
import bcrypt
from django.utils import timezone
import datetime

class DbOps:
    def __init__(self):
        pass

    @staticmethod
    def get_user(user_id: int = -1, username: str = None) -> dict:
        """Retrieves userdata from the database

        Args:
            user_id (int): user id of the user to be retrieved

        Returns:
            User: Database User Object
        """
        try:
            start = datetime.datetime.now()
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
                "rank": user.rank
            }
            end = datetime.datetime.now()
            print("Time taken:", end - start)
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
    def create_user(user_data: dict) -> bool:
        """Creates a new user in the database

        Args:
            user_data (dict): user data in dictionary format

        Returns:
            bool: True if user is created, False if creation fails
        """
        user_data_copy = user_data.copy()
        unhashed_password = user_data_copy.get("uPassword")
        hashed_password = str(bcrypt.hashpw(unhashed_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'))
        user_data_copy.update(
            {
                "uPassword": hashed_password
            })
        User.objects.create(
            uusername=user_data_copy.get('uUsername'),
            upassword=user_data_copy.get('uPassword'),
            uemail=user_data_copy.get('uEmail'),
            ufname=user_data_copy.get('uFname'),
            ulname=user_data_copy.get('uLname'),
            uregdate=timezone.now(),
            uprofilepic=user_data_copy.get('uProfilepic'),
            uprofilebgpic=user_data_copy.get('uProfilebgpic'),
            udesc=user_data_copy.get('uDesc'),
            uip=user_data_copy.get('uIp'),
            ucids=user_data_copy.get('ucIDs'),
            uIs42=user_data_copy.get('uIs42')
        )
        return True