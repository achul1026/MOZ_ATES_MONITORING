#!/bin/sh
export APP=${PWD##*/}
export COPY_PATH="/home/jboss/EAP-7.4.0/application/$APP/deployments/"
./gradlew clean && ./gradlew war && echo "copy to $COPY_PATH" && cp ./build/libs/*.war $COPY_PATH
