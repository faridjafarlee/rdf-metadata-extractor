# RDF METADATA EXTRACTOR

#### BEFORE USAGE

Install deps:
```bash
npm install
```

Configure proper database connection string in `.env` file:
```
DATABASE_CONNECTION_STRING=mysql://root:password@127.0.0.1:3306/rdf
```

Login to database interface and create database (for MySQL):
```
mysql -u root -p

> CREATE DATABASE rdf;
> exit;
```

Run database migrations:
```bash
npm run db:migrate
```

----

#### USAGE

Download and import all RDFs:
```bash
npm run import
```

Import RDF file(s):
```bash
npm run parse path/to/file.rdf path/to/another.rdf ...
```
example (single): 
```bash
npm run parse test/samples/pg1.rdf

File: test/samples/pg1.rdf
id: "1"
title: "The Declaration of Independence of the United States of America"
authors: [{"id":"1638","name":"Jefferson, Thomas","aliases":["United States President (1801-1809)"]}]
publisher: "Project Gutenberg"
published: "1971-12-01"
language: "en"
rights: "Public domain in the USA."

----
```
example (multiple):
```bash
npm run parse test/samples/pg1.rdf test/samples/pg2.rdf 

File: test/samples/pg1.rdf
id: "1"
title: "The Declaration of Independence of the United States of America"
authors: [{"id":"1638","name":"Jefferson, Thomas","aliases":["United States President (1801-1809)"]}]
publisher: "Project Gutenberg"
published: "1971-12-01"
language: "en"
rights: "Public domain in the USA."

----

File: test/samples/pg2.rdf
id: "2"
title: "The United States Bill of Rights\r\nThe Ten Original Amendments to the Constitution of the United States"
authors: [{"id":"1","name":"United States","aliases":["U.S.A."]}]
publisher: "Project Gutenberg"
published: "1972-12-01"
language: "en"
rights: "Public domain in the USA."

----
```

----

Tests:
```bash
npm test
```

Coverage:
```bash
npm run coverage
```

----

#### CHALLENGE

The challenge is to build a metadata extractor for all the project Gutenberg <br/>
titles which are available here: <br/>
​https://www.gutenberg.org/wiki/Gutenberg:Feeds <br/>
(​https://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.zip​)

Each book has an RDF file which will need to be processed to extract the:
```
* id (will be a number with 0-5 digits)
* title
* author/s
* publisher (value will always be Gutenberg)
* publication date
* language
* subject/s
* license rights
```
**Note:** For some books all of the data won't be available.

----

Your tasks are:
* Write a function that reads a single file in and outputs the correct output, <br/>
  using something like ​<br/>
  https://www.npmjs.com/package/xml2js​ or ​https://www.npmjs.com/package/xmldom <br/>
  will probably be useful to read the rdf files

* Store the output in a database of your choice locally for later querying, <br/>
  perhaps something like ​https://github.com/sequelize/sequelize​ with MySQL/PostGres <br/>
  or use something else!

* Write some unit tests in mocha for the code, <br/>
  use ​https://www.npmjs.com/package/istanbul to measure the code coverage
  
* Run the function against all the rdf files

* Send through the code once you're done!

----

Important aspects to consider:

* Scalability, how long does it take to index all the content

* Reliability, does all the information process correctly?

* Querying the dataset, how should the database be configured to search for specific fields
quickly?
```
* Title
* Author name
* Publication date
```