FROM python:3.12-alpine

# This ensures that the python output is sent straight to terminal without being buffered (flushed immediately)
ENV PYTHONUNBUFFERED 1

# We disable bytecode generation for cleaner build
ENV PYTHONDONTWRITEBYTECODE 1

# We create a directory for the app
WORKDIR /app

# We aopy the requirements file into the container
COPY requirements.txt /app

# We install the requirements
RUN pip install -r requirements.txt

# We copy the current directory into the container
COPY . /app

# We start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]