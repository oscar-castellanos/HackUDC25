#!/bin/sh
scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
port=$1

if [ -z "$port" ]
then
    port=8000
fi

python3 $scriptDir/manage.py migrate
python3 $scriptDir/manage.py runserver 0:$port