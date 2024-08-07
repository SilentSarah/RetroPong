from .Tournament import *
class TournamentService:
    @staticmethod
    async def join_tournament(ws, user, action, text_data):
        tournament: Tournament = TOURNAMENTS[0]
        match: TournamentMatch = tournament.parent_match
        
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
        # print_tree(tournament.parent_match, 10, 0)
        await ws.send_json({ 'Success': 'You have joined the tournament' })
        await broadcast_tournament_changes(match, tournament_map)
        