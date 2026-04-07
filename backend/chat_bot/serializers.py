# location: backend/chat_bot/serializers.py
from pydantic import ValidationError
from rest_framework import serializers
from .models import ChatSession, AiRequest
# choice
from BASE.base_choice import CeleryStatus


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = [
            "id",
            "title",
            "messages",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["messages", "created_at", "updated_at"]



class AiRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiRequest
        fields = [
            "id",
            "session",
            "message",
            "status",
            "response_engine",
            "response_style",
            "response",            
            "created_at",
        ]
        read_only_fields = ["status", "response", "created_at"]

    def validate(self, attrs):        
        message = attrs.get("message", "")
        session = attrs.get("session")
        user = self.context.get("request").user

        # Global Demo Mode: everyone uses the shared server API key
        from django.conf import settings
        if not getattr(settings, 'GEMINI_API_KEY', None):
            raise serializers.ValidationError(
                {"error": "Server API key configuration is missing."}
            )

        # Message validation
        if not message or not message.strip():
            raise serializers.ValidationError(
                {"message": "Message cannot be empty."}
            )

        # 3️⃣ BLOCK if last request is still running or pending
        last_request = (
            AiRequest.objects
            .filter(session=session)
            .order_by("-created_at")
            .first()
        )

        if last_request and last_request.status in (
            CeleryStatus.PENDING,
            CeleryStatus.RUNNING,
        ):
            raise serializers.ValidationError(
                "Please wait for the previous response to complete."
            )

        return attrs
