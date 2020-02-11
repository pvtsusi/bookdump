
Bookdump ![Bookdump logo](src/public/android-chrome-192x192.png)
========

![CI](https://travis-ci.org/pvtsusi/bookdump.svg?branch=master)

I made this web app to list out the books we wanted to get rid of. People we
knew reserved from the list what they wanted. The end result was that we got
a summary of what stack of books to deliver to whom. (And got rid of the
books! Hooray!)

The reasons why I did this instead of using a
[Google Sheet](https://www.google.com/sheets/about/) or whatever were:

* I wanted to scan barcodes and not type in all the book titles and authors.
  This is done with the companion
  [Bookbeep app](https://github.com/pvtsusi/Bookbeep).
* I wanted to try out React & Redux and other recent JavaScript stuff.

Running it
----------

It's running at [https://bookdu.mp](https://bookdu.mp) with a small remainder
of books. Below's instructions how to run an instance yourself

### Prerequisites

You'll need 

* [Node.js](https://nodejs.org) v12.7.0 or more recent.
* [Redis](https://redis.io) server running. Bookdump will use database 1.
* An [AWS S3](https://aws.amazon.com/s3) bucket that you can write objects
  and object ACLs to to. (Allow actions `s3:PutObject` and `s3:PutObjectAcl`.)

### Setup

Install the dependencies

    npm install

Set up a configuration either as environment variables or into the file
`.env` in format `ENVIRONMENT_VAR=value` per each line. The environment
variables to set are:

| Variable                | Value                                         |
|-------------------------|-----------------------------------------------|
| `AWS_ACCESS_KEY_ID`     | Access key ID that can write to the S3 bucket |
| `AWS_SECRET_ACCESS_KEY` | Secret access key for the S3 bucket           |
| `BUCKET`                | The plain name of the S3 bucket               |
| `BUCKET_REGION`         | The region of the S3 bucket, e.g. `eu-west-1` |
| `ADMIN_NAME`            | User name to log in with to the admin side    |
| `ADMIN_PASS`            | Password for the admin user                   |
| `APP_SECRET`            | Secret with which to sign cookies             |
| `USER_SECRET`           | Secret with which to hash users names         |

### Running

Start up Redis server

    redis-server

Start the dev environment server

    npm run dev

Navigate your browser to 
[http://localhost:5000](http://localhost:5000)

How to use
----------

Below is a walkthrough on how to use this thing.

### Setup Bookbeep

Install the [Bookbeep app](https://github.com/pvtsusi/Bookbeep) on your
iPhone. Set up the connection to Bookdump backend (port 5000 if you're running
this locally) and use the `ADMIN_NAME` and `ADMIN_PASS` values configured
above as credentials.

### Scan books

Scan a book that has a barcode with the app.

The app then requests Bookdump
for details based on the ISBN encoded in the barcode. Bookdump tries to
retrieve these from open library APIs. If there are several candidates
(usually because the titles are typed in slightly differently in different
library catalogues), select the better-looking one.

Finally, take a picture of the book cover and submit it. The book will appear
in Bookdump.

### Books without barcodes

Just take a picture of the book cover in Bookbeep and submit it. It will end
up in bookdump with a dummy ISBN and a nondescript title and author.

Then in Bookdump:

1. Log in with your admin credentials at `/admin`
   (e.g. [http://localhost:5000/admin](http://localhost:5000/admin)).
2. Click on the added book in the list
3. Click on the title and author to edit them, submit by pressing enter.

### Sharing the list

Send the URL to the bookdump instance to other people. They can reserve the
books they want at their leisure. They won't see each others' names or what
other people have reserved.

You can later check out in `/admin`
(e.g. [http://localhost:5000/admin](http://localhost:5000/admin)) to see who
has reserved what books.

Deployment
----------

Bookdump can be deployed to [Heroku](https://www.heroku.com) and can use the
[Heroku Redis add-on](https://elements.heroku.com/addons/heroku-redis).

Deploy using the Heroku
[instructions](https://devcenter.heroku.com/articles/git). Set the
configuration by using the environment variables described above, plus the
`REDIS_URL` documented
[here](https://devcenter.heroku.com/articles/heroku-redis).

About the code
--------------

A big bunch of stuff in this project was JavaScript-related things I hadn't
used before and wanted to try out. So this code might not be what you want
to look at if you want to learn how to use these tools The Right Way.

Here's the things I used the first time in practise:

* [React](https://reactjs.org) & [Redux](https://redux.js.org) (+ SSR)
* [Material-UI](https://material-ui.com)
* [Koa](https://koajs.com)
* The [async-await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) functions

### TODO

* More unit tests
* End-to-end tests
* Code splitting?
* Multiple collections of books & signing up to add them?
* 

License
-------

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
