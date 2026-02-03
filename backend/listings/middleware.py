"""
Custom Middleware for BYN-K Platform.

Phase 3: Security - Disclaimer Injection
Ensures every API response includes the mandatory disclaimer.
"""

from django.conf import settings
import json


class DisclaimerMiddleware:
    """
    Middleware to inject disclaimer into API responses.
    
    Ensures every JSON API response includes the platform disclaimer
    stating that we are not the hiring entity.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Only modify JSON API responses
        if (
            request.path.startswith('/api/') and 
            response.get('Content-Type', '').startswith('application/json')
        ):
            try:
                # Parse the response content
                content = json.loads(response.content.decode('utf-8'))
                
                # Add disclaimer if not already present
                if isinstance(content, dict) and 'disclaimer' not in content:
                    content['disclaimer'] = settings.PLATFORM_DISCLAIMER
                    response.content = json.dumps(content).encode('utf-8')
                    response['Content-Length'] = len(response.content)
            except (json.JSONDecodeError, UnicodeDecodeError):
                # If we can't parse the JSON, just return the original response
                pass
        
        return response
