from .Tournament import *

def find_tournament_member(user_id: int):
    for user in TOURNAMENT_USERS:
        if (user.id == user_id):
            return user
    return None
class TournamentService:
    @staticmethod
    async def join_tournament(ws, user, action, text_data):
        tournament: Tournament = TOURNAMENTS[0]
        match: TournamentMatch = tournament.parent_match
        if (tournament.joined_players == 8):
            return  await user.send_message_to_self(
                                                { 
                                                    "request":"tournament", 
                                                    "action":action,  
                                                    "status":"fail",
                                                    "message":"Tournament is full"
                                                })
        if (find_player_in_tree(match, user)):
            return await user.send_message_to_self(
                                                { 
                                                    "request":"tournament", 
                                                    "action":action,  
                                                    "status":"fail",
                                                    "message":"You've already joined the tournament"
                                                })
        tournament.joined_players += 1
        fill_nodes_at_depth(match, user)
        tournament_map = await generate_tournament_map(match)
            
        await user.send_message_to_self({
            "request":"tournament",
            "action":"info",
            "status":"success",
            "message":"You've joined the tournament"
        })
        await broadcast_tournament_changes(tournament_map)
        
        if (tournament.joined_players == 2):
            await broadcast_tournament_message("Tournament is starting after 1 minute")
            await set_tournament_played_status()
            await broadcast_tournament_action("start", {})
            await start_tournament(tournament)
        
        
    @staticmethod
    async def get_tournament_update(ws, user, action, text_data):
        tournament: Tournament = TOURNAMENTS[0]
        match: TournamentMatch = tournament.parent_match
        tournament_map = await generate_tournament_map(match)
        if (tournament.winner is not None):
            winner = tournament.winner
            winner_data = await setup_player_data(winner)
            tournament_map.update({"winner" : winner_data})
        await ws.send_json(
            {
                "request":"tournament",
                "action":action,
                "status":"success",
                "data": tournament_map
            })