from datetime import datetime

class PrivateQueue:
    def __init__(self, inviter: int, invitee: int):
        self.inviter : int = inviter
        self.invitee : int = invitee
        self.created_at : int = datetime.now()
        
    def get_inviter(self) -> int:
        return self.inviter

    def get_invitee(self) -> int:
        return self.invitee

PRIVATE_QUEUE : list[PrivateQueue] = []


def get_existing_invite(inviter: int) -> PrivateQueue:
    for queue in PRIVATE_QUEUE:
        print(queue.get_inviter(), inviter)
        if (queue.get_inviter() == inviter):
            return queue
    return None

def invitee_get_invite(invitee: int) -> PrivateQueue:
    for queue in PRIVATE_QUEUE:
        if (queue.get_invitee() == invitee):
            return queue
    return None