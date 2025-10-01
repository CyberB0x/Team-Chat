from django.db import models
from django.conf import settings

class Room(models.Model):
    """
    Represents a chat room where users can exchange message.
    """
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    """
    Represents a single message sent by a user in a chat room.
    """
    room = models.ForeignKey(Room, related_name="message", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}"
