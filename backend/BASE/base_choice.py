# location: backend/BASE/base_choice.py
from django.db.models import TextChoices, IntegerChoices


# for: backend/accounts/models.py
class StatusChoice(TextChoices):
    ACTIVE = 'active', 'Active'
    SUSPENDED = 'suspended', 'Suspended'
    BAN = 'ban', 'Ban'

class GenderChoice(TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'

class AccountPlanChoice(TextChoices):
    FREE = 'free', 'Free'
    PRO = 'pro', 'Pro'
    PREMIUM = 'premium', 'Premium'
    
class LanguageChoice(TextChoices):
    ENGLISH = 'english', 'English'
    BANGLA = 'bangla', 'Bangla'



# for: backend/api_key/models.py
# for: backend/chat_bot/models.py
class CeleryStatus(TextChoices):
    PENDING = 'PENDING', 'Pending'
    RUNNING = 'RUNNING', 'Running'
    COMPLETED = 'COMPLETED', 'Completed'
    FAILED = 'FAILED', 'Failed'


# for: backend/chat_bot/models.py
class ChatEngine(IntegerChoices):
    """ Only using Gemma 3 27B for the Beta release """
    GEMMA_3_27B = 1, "gemma-3-27b-it"

# for: backend/chat_bot/models.py
class ModelStyle(TextChoices):
    """ types of character styles i am using to response """
    SUPPORTIVE = "supportive", "Supportive"
    CASUAL = "casual", "Casual"
    DEEP_THINKING = "deep_thinking", "Deep_thinking" # special approach


# for: backend/contact_us/models.py
class ServiceType(TextChoices):
    GENERAL_INQUIRY = "general_inquiry", "General_Inquiry"
    DOCUMENT_REVIEW = "document_review", "Document_Review"
    EMERGENCY_LEGAL_HELP = "emergency_legal_help", "Emergency_Legal_Help"
    LEGAL_ADVICE = "legal_advice", "Legal_Advice"
    LEGAL_RESEARCH = "legal_research", "Legal_Research"
    BUG_REPORT = "bug_report", "Bug_Report"
    OTHER = "other", "Other"

class PriorityLevel(TextChoices):
    NORMAL = "normal", "Normal"
    URGENT = "urgent", "Urgent" 
    EMERGENCY = "emergency" , "Emergency"