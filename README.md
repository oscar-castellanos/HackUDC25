# ClothingCompare

## What is ClothingCompare?
ClothingCompare is an application based on the Django REST Framework and React built to provide 2 main services:
* The comparison of different purchase options with additional metrics such as a calculated sustainability index.
* The suggestion of outfits through image search or a natural language description done through large language model technologies, which help users find items they don't know they want yet.

This solutions are provided thanks to the InditexTECH REST APIs [VisualSearch](https://developer.inditex.com/apimktplc/web/products/pubapimkt/protocols/REST/apis/visual-search/overview) and [ProductSearch](https://developer.inditex.com/apimktplc/web/products/pubapimkt/protocols/REST/apis/product-search/overview).

ClothingCompare can be accessed both as a REST API with a series of endpoints or as a web portal developed in React once the application is deployed and it's deployed with the ease of a command by writing a simple 'docker compose'.

## Dependencies
ClothingCompare aims to serve as an easy-to-use and deploy application, so the amount of dependencies has been kept as a minimum.

You only need [Docker](https://www.docker.com/) and the credentials needed for the [InditexTECH REST APIs](https://developer.inditex.com/apimktplc/web/home). 

A quickstart guide to creating an application and attaching APIs to it can be found in [this link](https://developer.inditex.com/apimktplc/web/get-started/overview/quickstart).


//Explica xian porfa lo de donde están.

You will, however, need to set a series of environment variables in your system prior to composing the Docker containers. They are explained below and can be set in :
* **USER_INDITEX_API->** Your OATH2 Client ID from your application.
* **SECRET_INDITEX_API->** Your OATH2 Client ID from your application.
* **TEXT_MODEL->** LLM model for text-based queries.
* **VISUAL_MODEL->** LLM model for image-based queries.

It's critical that you have your Application promoted to production, the mentioned APIs added to it and authorized to perform requests.

In our case, we have used the llama 3.2 and llava models for testing the application and as such their license is included in our project's [license](/LICENSE).

## How does it work?
//Xian por favor explica como va lo de configurar el Docker.

Once the containers are up and running a series of API Rest will be available to use, as well as a web portal for access to its features.

The web portal can be accessed through the port 8080 while the API Rest can be accessed through port 8000.

Firstly, before introducing the API, we introduce our json result for clothing recovery. Information is added to the results provided by the Inditex API through web-scraping that is performed over the store webpages of the products and it's done natively on Python through the BeautifulSoup package. This information is used to enrich our data and provide a better comparison system, using values such as the materials of the clothing. We call this struct ClothingDetail and an example can be found below:
```json
{
        "id": "414956079",
        "name": "Z1975 TIE DENIM SHIRT",
        "price_currency": "EUR",
        "price_current": 29.95,
        "price_original": null,
        "link": "https://zara.com/es/en/-P06147169.html?v1=414965706",
        "brand": "zara",
        "color": "Blue ",
        "description": "High neck long sleeve shirt with tie.",
        "composition": [
            {
                "material": "cotton",
                "percentage": "64"
            },
            {
                "material": "viscose",
                "percentage": "36"
            }
        ],
        "image_url": "https://static.zara.net/assets/public/5454/62b2/8ebd4852aed1/50fb7eadd922/06147169407-000-p/06147169407-000-p.jpg?ts=1740154383215&w=1920",
        "score": 27.200000000000003
    }
```

//Aquí deberíamos incluir ejemplos de jsons...
The services available from the API are:
* **clothing_app/** -> Allows to add clothing following the ClothingDetail model through a POST request and list all added clothes in the database with a GET request.
* **clothing_app/user_clothing/\<username>** -> Allows for the viewing of all images that an user has uploaded as a GET request or to upload an image through a POST request. Add \\<image_id> to see only that specific image in a GET Request or remove it through a DELETE request.
* **clothing_app/wishlist/\<username>** -> Allows for the viewing of all wishlisted clothes by a specific user as a GET request or to add a clothing to its wishlist through a POST request. Add \\<clothing_id> to see only a specific wishlisted clothing with a GET request or remove it with a DELETE request.
* **clothing_app/product_search** -> Allows for the search of similar items in Inditex shops that the one that is described in the input of a GET Request. The parameters 'description' is compulsory and it will be used to search for similar items while the parameter 'brand' is optional and will be used to search in a specific store. The results will be returned in the ClothingDetail struct.
* **clothing_app/visual_search** -> Allows for the search of similar items from an image included in a POST request. The image must be uploaded in any server and it's included as img_url parameter in the request data. The results are returned in the ClothingDetail struct.
* **clothing_app/visual_search/outfit_search** -> From a ClothingDetail struct included in the data of the POST Request, we provide an outfit recommendation of 5 outfits provided by an LLM-model. These outfits are then passed through the ProductSearch API in order to find shop products that represent them and are enriched through web scraping. They are then returned to be compared.
* **clothing_app/visual_search/outfit_photo_search/** -> Similar to the last one, except it takes a photo provided in the same format as in the **visual_search** endpoint. It returns the outfits that match the piece of clothing sent as a photo.
* **clothing_app/prompt_search** -> From a 'description' parameter in natural language, it uses the LLM-model to extract the keywords in a format that is acceptable for the InditexTECH API (due to size limitations) and it searches for products that suite the style or needs reflected in the parameter.

Apart from the API, the React webpage provides an easy-to-use reactive and interactive interface that allows for photo uploading, taking of photographies through webcam for the visual endpoints, as well as text-based prompts for text-based endpoints. 

// tempfiles
The webpage uses tempfiles, 
## Issues
Issues can be filled out in the GitHub page using the templates provided, please be as clear and concise as possible with your issue and one of the mantainers will try to contact you as soon as possible based on the standards and pledges made on our [Contributing](/CONTRIBUTING.md) page.

## How can you be a part of ClothingCompare?
You can contribute to ClothingCompare by solving Issues left by the developers or by other members of the community. Please do mind the limitations, advice and rules that these contributions must comply with. They are 

## Current Contributions
The contributors of this project are the following:
* **oscar-castellanos->** Django back-end implementation and Docker composition setup.
* **afdezfraga->** React front-end development, interface design and data model design. 
* **xveiga->** Implementation of LLM-model connection, support on front-end implementation and interface design.
* **Erivos->** Implementation of InditexTECH API connection, web-scraping and support on back-end implementation.

## License
The project is licensed under the GPL-3 License. For more details, please refer to the [LICENSE](./LICENSE) file. Additionally, the licenses  the llama models used in testing can also be found in the [LICENSE](./LICENSE) file.

## What's next for ClothingCompare
ClothingCompare still hasn't reached its peak and has many more improvements that can be applied. The main points of future work that the current mantainer team has proposed are:
* Add more sustainability metrics.
* Add web-scraping modules for other webs of the Inditex suite.
* User account system to save outfits and searches.