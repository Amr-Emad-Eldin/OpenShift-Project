# Backend Dockerfile

# Step 1: Use a lightweight Python base image
FROM python:3.11-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy the requirements.txt to the container
COPY requirements.txt /app/

# Step 4: Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the rest of the backend application code
COPY . /app/

# Step 6: Expose the port on which the app runs (default 5000 for Flask)
EXPOSE 5000

# Step 7: Set the entrypoint to run the app
CMD ["python", "app.py"]