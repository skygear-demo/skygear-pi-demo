#!/bin/bash
if [ "$1" == "gen" ]
then
  echo 'SKYGEAR_ENDPOINT="'$2'"' >> ./skygear.env
  echo 'SKYGEAR_APIKEY="'$3'"' >> ./skygear.env
else
  source ./skygear.env

  export SKYGEAR_APIKEY=$SKYGEAR_APIKEY
  export SKYGEAR_ENDPOINT=$SKYGEAR_ENDPOINT
  echo "Loaded Endpoint and API Key to env"
  echo $SKYGEAR_ENDPOINT
  echo $SKYGEAR_APIKEY
  
fi