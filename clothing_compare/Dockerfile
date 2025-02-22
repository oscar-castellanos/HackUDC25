FROM python:3.10-alpine

COPY requirements.txt requirements.txt
COPY start_server.sh start_server.sh

RUN pip install -r requirements.txt

EXPOSE 8000

COPY . .

CMD ["sh", "start_server.sh", "8000"]