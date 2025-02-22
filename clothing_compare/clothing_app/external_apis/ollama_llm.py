import ollama
from pprint import pprint

OLLAMA_MODEL = "llama3.2:3b"

# Singleton class to ensure only one instance of Ollama is created
class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class OllamaLLM(metaclass=Singleton):
    def __init__(self, model = OLLAMA_MODEL):
        self.__model = model
        # Preload selected model
        self.download_ollama_model(self.__model)

    # Download selected model if not existing
    def download_ollama_model(self, selected_model):
        model_found = False
        for model in ollama.list()['models']:
            if selected_model in model['model']:
                model_found = True
                break
        if not model_found:
            ollama.pull(selected_model)

    # Generate text from a prompt (and optional previous context from system prompt)
    def generate_text(self, prompt, system_prompt = None):
        response = ollama.generate(model=self.__model, system=system_prompt, stream=False, prompt=prompt)
        return response.response
    
    # Generate chat response, with the context of a previous message history
    def chat(self, user_input, messages=None):
        ollama_input = [{
            'role': 'user', 'content': user_input}
            ]

        # Append history if it exists
        if messages is None:
            ollama_history = ollama_input
        else:
            ollama_history = messages
            ollama_history += ollama_input
        
        response = ollama.chat(model=self.__model, messages=ollama_history, stream=False)

        # Add response to mantain history
        ollama_history += [
            {'role': 'assistant', 'content': response.message.content},
        ]

        # Return message and chain of previous messages
        return (response.message.content, ollama_history)