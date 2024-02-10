from django.shortcuts import render
from django.http import HttpResponse
from openai import OpenAI
from django.http import JsonResponse
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()


# Create your views here.
def say_hello(request):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a chatbot that help users with any kind of questions"},
            {"role": "user", "content": "How do you say hello in French?"}
        ]
    )
    print(completion)
    return HttpResponse(completion.choices[0].message)
