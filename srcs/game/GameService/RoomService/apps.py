from django.apps import AppConfig
from .TournamentMatch import *


tournament = Tournament("RetroPong")

class RoomserviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'RoomService'
    
    def ready(self) -> None:
        tournament.parent_match = generate_match_tree(0)
        TOURNAMENTS.append(tournament)
        