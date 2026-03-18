WhatsApp Messaging using Pywhatkit
Requires: pip install pywhatkit
Note: Opens WhatsApp Web in browser
"""

import pywhatkit as kit
import datetime

class WhatsAppPywhatkit:
    """Simple WhatsApp messaging using pywhatkit"""
    
    def send_message(self, phone_number: str, message: str, hour: int = None, minute: int = None):
        """
        Send text message to a phone number
        
        Args:
            phone_number: Phone number with country code (e.g., '+1234567890')
            message: Text message to send
            hour: Hour to send (24-hour format), defaults to now + 1 min
            minute: Minute to send
        """
        if hour is None or minute is None:
            now = datetime.datetime.now()
            hour = now.hour
            minute = now.minute + 2  # Send in 2 minutes
            
        try:
            kit.sendwhatmsg(phone_number, message, hour, minute)
            print(f"Message scheduled to {phone_number}")
        except Exception as e:
            print(f"Error: {e}")
    
    def send_image(self, phone_number: str, image_path: str, caption: str = ""):
        """Send image with optional caption"""
        try:
            kit.sendwhats_image(phone_number, image_path, caption)
            print(f"Image sent to {phone_number}")
        except Exception as e:
            print(f"Error: {e}")
    
    def send_to_group(self, group_id: str, message: str, hour: int, minute: int):
        """Send message to a WhatsApp group"""
        try:
            kit.sendwhatmsg_to_group(group_id, message, hour, minute)
            print(f"Message sent to group {group_id}")
        except Exception as e:
            print(f"Error: {e}")


# Usage Example
if __name__ == "__main__":
    wa = WhatsAppPywhatkit()
    
    # Send text message
    wa.send_message("+1234567890", "Hello! This is a test message.")
    
    # Send image
    wa.send_image("+1234567890", "path/to/image.jpg", "Check this out!")
