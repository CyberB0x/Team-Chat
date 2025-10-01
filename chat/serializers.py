from rest_framework import serializers
from .models import Room, Message

class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for chat messages.
    """
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "user", "content", "created_at"]


class RoomSerializer(serializers.ModelSerializer):
    """
    Serializer for chat rooms.
    Includes nested messages if requested.
    """
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["id", "name", "created_at", "messages"]
