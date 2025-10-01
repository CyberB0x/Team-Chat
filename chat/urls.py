from django.urls import path
from .views import RoomListCreateView, MessageListCreateView

urlpatterns = [
    path("rooms/", RoomListCreateView.as_view(), name="room-list"),
    path("rooms/<int:room_id>/messages/", MessageListCreateView.as_view(), name="room-messages"),
]