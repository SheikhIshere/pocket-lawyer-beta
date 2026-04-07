from rest_framework.throttling import AnonRateThrottle

class SecureAnonRateThrottle(AnonRateThrottle):
    """
    Custom throttle that only applies to POST requests
    and provides a more descriptive security-focused error message.
    """
    rate = '10/day'
    
    def allow_request(self, request, view):
        # Only throttle POST requests (sending messages/creating sessions)
        if request.method != 'POST':
            return True
        return super().allow_request(request, view)

    def wait(self):
        # Custom wait message can be handled in the exception handler, 
        # but here we can at least help the developer.
        return super().wait()
