import os
# Include testing tools when MINDRIAN_TESTING=true
TESTING = os.getenv("MINDRIAN_TESTING", "").lower() == "true"