from django.contrib import admin
from .models import ChatSession, AiRequest


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "title",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("title", "user__email")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("id", "user", "title", "status")
        }),
        ("Conversation", {
            "fields": ("messages",),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )


@admin.register(AiRequest)
class AiRequestAdmin(admin.ModelAdmin):
    list_display = (
        # "id",
        "user",
        "session",
        "status",
        "response_engine",
        "created_at",
    )
    list_filter = ("status", "response_engine", "created_at")
    search_fields = ("message", "response", "user__email")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("Request Info", {
            "fields": ("id", "user", "session", "status")
        }),
        ("Prompt & Response", {
            "fields": ("message", "response"),
        }),
        ("AI Settings", {
            "fields": ("response_engine", "response_style"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )