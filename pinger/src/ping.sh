#!/bin/sh
set -e
export OPTIONS=$OPTIONS

while true; do
    for var in $(env | grep '^API_URL_' | cut -d= -f1); do
        url=$(eval "echo \$$var") # Get the value of the environment variable
        echo "Making request to $url"
        curl -s --max-time 45 $url
        sleep 2
    done
    sleep 60
done
