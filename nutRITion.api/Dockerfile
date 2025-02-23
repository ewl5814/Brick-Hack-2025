FROM public.ecr.aws/ubuntu/ubuntu:20.04

RUN apt-get update
RUN apt-get install python3 python3-pip postgresql -y
RUN pip3 install --upgrade pip
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt

COPY ./src/main.py /app

CMD python3 server.py
