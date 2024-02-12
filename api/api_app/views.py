import json

from django.http import JsonResponse
from django.middleware.csrf import get_token
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# Let's orient the chatbot towards assisting users on any kind of topics
chatbot_context_messages = [
    {"role": "system", "content": "You are a chatbot that help users with any kind of questions"}
]


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


def query_chatbot(request):
    # We will only handle post requests
    if request.method == "POST":
        # We retrieve the form data

        # We first need to parse the request body
        body = json.loads(request.body.decode('utf-8'))

        # We can now access our form data
        user_model = body.get("model")
        user_messages = body.get("messages")

        # We query the OpenAI API
        completion = client.chat.completions.create(
            model=user_model,
            messages=chatbot_context_messages + user_messages,
        )

        # We return the response back to the user
        return JsonResponse({"message": completion.choices[0].message.content})
    else:
        # We'll accept only POST requests
        return JsonResponse({"error": "Method not allowed."}, status=405)
