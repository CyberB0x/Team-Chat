from rest_framework import generics, permissions
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer

class RoomListCreateView(generics.ListCreateAPIView):
    """
    Allows users to list or create chat rooms.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageListCreateView(generics.ListCreateAPIView):
    """
    Allows users to view or send messages in a room.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs["room_id"]
        return Message.objects.filter(room_id=room_id).order_by("created_at")

    def perform_create(self, serializer):
        room_id = self.kwargs["room_id"]
        serializer.save(user=self.request.user, room_id=room_id)
