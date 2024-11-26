

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

FROM python:3.12.1-slim

COPY /back /back

WORKDIR /back


RUN pip3 install -r requirements.txt
    

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.

# Switch to the non-privileged user to run the application.


# Copy the source code into the container.
 

# Expose the port that the application listens on.

# Run the application.
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
