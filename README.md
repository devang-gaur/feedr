# Feedr

    A simple logstash-elasticsearch hack to keep up with your RSS feeds

## One time setup

    * setup nodejs in your local machine.

        > $npm install -g express

    * Download [logstash-5.1.2.zip](https://artifacts.elastic.co/downloads/logstash/logstash-5.1.2.tar.gz) and extract directory and install rss-input and elasticsearch-output plugins.

        > $ _pathtologstashdir_/bin/logstash-plugin install logstash-input-rss

        > $ _pathtologstashdir_/bin/logstash-plugin install logstash-output-elasticsearch


    * Download [elasticsearch-2.4.1.zip](https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/zip/elasticsearch/2.4.1/elasticsearch-2.4.1.zip) and extract directory.


A map of RSS aliases and feed url is maintained at __feedmap.json__ . It has a 4 feed entries for a start.
You can alter them (__don't screw up the json syntax__).

##### config file for logstash : readerapp.conf

## Shoot up elasticsearch

    Open a new terminal window. Navigate to elasticsearch-2.4.1 directory.

    > $ bin/elasticsearch

    check if elasticsearch is running on port 9200.

    > $ curl -XPUT 'http://localhost:9200/reader

    this will create '__reader__' index for our app.


## Shoot up logstash

    Open a terminal window. Navigate to feedr directory.

    > $ _path-to-logstashdir_/bin/logstash -f readerapp.conf -r  ( __-r flag is important__ )


## Start the app

    Open a terminal window. Navigate to feedr directory.

    > $ npm install

    > $ gulp

Open up http://localhost:3000 in your browser. Enjoy.