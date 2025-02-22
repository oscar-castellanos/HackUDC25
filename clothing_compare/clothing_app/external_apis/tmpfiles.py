import requests
import urllib
import base64

def upload_local_file_to_web(file_path, file_name="image.jpg"):
    # Forward file to tmpfiles
    url = 'https://tmpfiles.org/api/v1/upload'
    files = {'file':(file_name, open(file_path, 'rb'))}
    r = requests.post(url, files=files)
    if r.status_code != 200:
        return None

    data = r.json().get('data')
    if not data:
        return None
    
    # Insert /dl/ on path to obtain direct link to image
    url = data.get('url')
    direct_link = "{uri.scheme}://{uri.netloc}/dl{uri.path}".format(
        uri=urllib.parse.urlparse(url)
    )
    return direct_link

def upload_base64_file_to_web(base64data, file_name="image.jpg"):
    # Forward file to tmpfiles
    url = 'https://tmpfiles.org/api/v1/upload'
    filedata = base64.b64decode(base64data)
    files = {'file':(file_name, filedata)}
    r = requests.post(url, files=files)
    if r.status_code != 200:
        return None

    data = r.json().get('data')
    if not data:
        return None
    
    # Insert /dl/ on path to obtain direct link to image
    url = data.get('url')
    direct_link = "{uri.scheme}://{uri.netloc}/dl{uri.path}".format(
        uri=urllib.parse.urlparse(url)
    )
    return direct_link