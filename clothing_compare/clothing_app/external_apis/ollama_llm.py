import ollama
import requests
import base64
import pprint

OLLAMA_MODEL = "llama3.2:3b"
VISUAL_MODEL = "llava:7b"

# Utility method to encode an image from a URL to base64 to pass to ollama
def get_base64_image_from_url(image_url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    response = requests.get(image_url, headers=headers)
    image_data = response.content
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return base64_image

# Singleton class to ensure only one instance of Ollama is created
class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class OllamaLLM(metaclass=Singleton):
    def __init__(self, model = OLLAMA_MODEL, visual_model = VISUAL_MODEL):
        self.__model = model
        self.__visual_model = visual_model
        # Preload selected models
        self.download_ollama_model(self.__model)
        self.download_ollama_model(self.__visual_model)
        
    def __parse_outfit(self, outfit):
        """
        Parses a given outfit string into a structured format.
        The input string is expected to be divided into sections by "#####".
        Each section represents an outfit and contains lines describing the outfit's details.
        Args:
            outfit (str): The string representation of outfits to be parsed.
        Returns:
            tuple: A tuple containing:
                - outfit_list (list): A list of dictionaries, each representing an outfit with its details.
                - originalPrompt (str or None): The key of the outfit part that does not have a "Category" field, or None if all parts have a "Category".
        """
        outfits = outfit.split("#####")[1:]
        
        outfit_list = []
        
        for outfit in outfits:
            current_outfit = {}
            outfit_lines = outfit.split("\n")
            current_outfit["description"] = outfit_lines[1].strip()
            current_outfit["outfit_parts"] = {}
            current_part_of_outfit = ""
            for line in outfit_lines[2:]:
                if line.strip() == "":
                    continue
                if line.strip()[0] == "*":
                    current_part_of_outfit = line.strip()[1:].split(":")[0].strip()
                    current_outfit["outfit_parts"][current_part_of_outfit] = {"Name": line.strip()[1:].split(":")[1].strip()}
                if line.strip()[0] == "+":
                    line = line.strip()[1:]
                    if len(line.split(":")) == 1:
                        continue
                    current_outfit["outfit_parts"][current_part_of_outfit][line.strip().split(":")[0].strip()] = line.strip().split(":")[1].strip()
                    ##current_outfit[current_part_of_outfit][line.strip().split(":")[0].strip()] = line.strip().split(":")[1].strip()
                else:
                    continue
            outfit_list.append(current_outfit)


        base_outfit = outfit_list[0]
        # The original prompt will not have Category
        originalPrompt = None
        for key in base_outfit["outfit_parts"].keys():
            if base_outfit["outfit_parts"][key].get("Category") is None:
                originalPrompt = key
                break
        return outfit_list, originalPrompt

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
    
    # Generate outfits from the description of a piece of clothing.
    def generate_outfit(self, description, color=""):
        system_prompt = f"""
        You are an outfit generator who gives out recommendations of outfits based on the description and color given. 
        Even if it's in a different language, do the description in English.
        You need to provide 5 different and distinct outfits.
        Each outfit should contain the object described in the prompt and they should match based on fashion rules and color theory.
        Give a small description of each outfit and separate them by ##### and a line break.
        For each outfit, provide a description of each piece of clothing and accesory, preceded by the category of the clothing.
        Each outfit must contain top, bottom, shoes and at least one accessory.
        If you are not given a color, try to get it from the description or to generate a color that matches the description.
        If you are not given a description, ignore the prompt and only say "No description provided".
        
        The result must be returned in the following format:
        
            ##### Outfit 1
        The outfit starts with a black relaxed fit shirt, made from a blend of viscose and cotton fabrics. The camp collar adds a casual touch to the top, while the short sleeves provide a comfortable fit.

        * Top: Black Relaxed Fit Shirt (Viscose and Cotton Blend)
                + Description: A casual button-up shirt featuring a camp collar and short sleeves.
                + Color: Black

        The bottom is a pair of dark blue skinny jeans, providing a sleek contrast to the casual top.

        * Bottom: Dark Blue Skinny Jeans
                + Category: Pants
                + Description: Slim-fit jeans with a straight leg and a subtle stretch.

        Black Chelsea boots add a stylish touch to the outfit, completing the relaxed yet polished look.

        * Shoes: Black Chelsea Boots
                + Category: Shoes
                + Description: Classic ankle-high boots featuring an elastic side panel and a slip-on design.

        A simple silver necklace adds a pop of elegance to the overall look.

        * Accessory: Silver Necklace
                + Category: Accessories
                + Description: A delicate chain necklace featuring a small pendant.

        ##### Outfit 2
        The outfit starts with the same black relaxed fit shirt, paired with a pair of light gray trousers for a crisp contrast.

        * Top: Black Relaxed Fit Shirt (Viscose and Cotton Blend)
                + ... (same as before)

        * Bottom: Light Gray Trousers
                + Category: Pants
                + Description: Slim-fit trousers featuring a straight leg and a subtle stretch.

        Black dress shoes add a level of sophistication to the outfit, elevating the look from casual to polished.

        * Shoes: Black Dress Shoes
                + Category: Shoes
                + Description: Classic black pumps featuring a low heel and a sleek design.

        A simple leather belt completes the outfit, adding a touch of rugged elegance.

        * Accessory: Leather Belt
                + Category: Accessories
                + Description: A classic brown leather belt featuring a simple buckle.

        ##### Outfit 3
        The outfit starts with the same black relaxed fit shirt, paired with a pair of olive green chinos for a bold contrast.

        * Top: Black Relaxed Fit Shirt (Viscose and Cotton Blend)
                + ... (same as before)

        * Bottom: Olive Green Chinos
                + Category: Pants
                + Description: Slim-fit chinos featuring a straight leg and a subtle stretch.

        Black ankle boots add a stylish touch to the outfit, providing a rugged contrast to the green pants.

        * Shoes: Black Ankle Boots
                + Category: Shoes
                + Description: Classic ankle-high boots featuring a chunky sole and a lugged design.

        A simple canvas tote bag adds a practical touch to the outfit, completing the casual-chic look.

        * Accessory: Canvas Tote Bag
                + Category: Accessories
                + Description: A lightweight canvas tote bag featuring a simple strap and a neutral color.

        ##### Outfit 4
        The outfit starts with the same black relaxed fit shirt, paired with a pair of navy blue slim-fit pants for a sleek contrast.

        * Top: Black Relaxed Fit Shirt (Viscose and Cotton Blend)
                + ... (same as before)

        * Bottom: Navy Blue Slim-Fit Pants
                + Category: Pants
                + Description: Slim-fit pants featuring a straight leg and a subtle stretch.

        Black loafers add a level of sophistication to the outfit, providing a polished contrast to the relaxed top.

        * Shoes: Black Loafers
                + Category: Shoes
                + Description: Classic black loafers featuring a slip-on design and a sleek sole.

        A simple silver watch completes the outfit, adding a touch of elegance.

        * Accessory: Silver Watch
                + Category: Accessories
                + Description: A classic watch featuring a leather strap and a minimalist design.

        ##### Outfit 5
        The outfit starts with the same black relaxed fit shirt, paired with a pair of burgundy skinny jeans for a bold contrast.

        * Top: Black Relaxed Fit Shirt (Viscose and Cotton Blend)
                + ... (same as before)

        * Bottom: Burgundy Skinny Jeans
                + Category: Pants
                + Description: Slim-fit jeans featuring a straight leg and a subtle stretch.

        Black boots add a stylish touch to the outfit, providing a rugged contrast to the bold pants.

        * Shoes: Black Boots
                + Category: Shoes
                + Description: Classic ankle-high boots featuring a chunky sole and a lugged design.

        A simple red scarf adds a pop of color to the outfit, completing the edgy-chic look.

        * Accessory: Red Scarf
                + Category: Accessories
                + Description: A lightweight scarf featuring a subtle texture and a vibrant red color.
        
        """
        prompt = f"""
        The description of the outfit is "{description}" and the color is "{color}".
        Generate 5 different outfits based on this description and color.
        """
        response = self.generate_text(prompt, system_prompt)
        outfits, originalPrompt = self.__parse_outfit(response)
        
        return outfits, originalPrompt
    
    # Generate an outfit description from a given image
    def describe_outfit_from_image(self, image_url):
        image = get_base64_image_from_url(image_url)
        if image is None:
            return None
        system_prompt = f"""
        You will be shown a stock photograph from a clothing store.
        Describe the overall style of the clothing.
        If it is an outfit, try to give details about the top, bottom, shoes and accessories, as well as the color.
        If it is a separate item, describe it with as much detail as possible.
        Describe any possible logos, and read out any visible text.
        If there is any image or pattern stamped on the clothing, describe it.
        If possible, give extra information about the color palette used, the tonality, the color combinations and how it fits the overall style.
        Try to generate tags about the style, such as flashy, discrete, sharp, edgy, formal, etc...
        Name the strongest or predominant colors found on the image.
        Try to differentiate between conflicting colors, and give a general idea of the color harmony.
        If any of this information is not visible exclude the explanation from the output.
        Keep it concise.
        """
        messages = [{'role': 'user', 'content': system_prompt, 'images': [image]}]
        response = ollama.chat(model=self.__visual_model, messages=messages, stream=False)
        return response.message.content
    
#if __name__ == '__main__':
    # Example usage of the describe outfit function
    # ollama_llm = OllamaLLM()
    # image_url = "https://static.zara.net/assets/public/6c3e/9033/ddf64d36a0bf/8ee8d1feeee6/06085303098-a1/06085303098-a1.jpg?ts=1736349686062&w=1024"
    # outfit_description = ollama_llm.describe_outfit_from_image(image_url)

    # print(outfit_description)

    ## Example usage of the generate outfit function
    # ollama_llm = OllamaLLM()
    # outfit_json, original_prompt = ollama_llm.generate_outfit("Relaxed fit shirt made of a viscose and cotton blend fabric. Camp collar and short sleeves. Button-up front.", "black")
    
    # pprint(outfit_json)
    # print(original_prompt)