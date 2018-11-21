---
id: getting_started
author: GoodData
sidebar_label: Getting started
title: Getting started
---

Supported Versions
-------

You want to know which Ruby to use with the SDK.

Here is a list of supported ruby versions. 

-   Ruby 1.9.3

-   Ruby 2.0

-   Ruby 2.1

-   Ruby 2.2

-   JRuby with Oracle Java 1.8.0.51

-   JRuby with OpenJDK 1.8.0.51

Unfortunately JRuby with latest version of Java (1.8.0.60) is not
supported because of issues with SSL. Using latest JRuby with Java
higher than 1.8.0.51 is going to cause network communication issues
(WebDav authentication). We will support latest Java as soon as soon as
these issues are resolved.


Installing GoodData Ruby SDK
--------

If you are using bundler, add

    gem "gooddata"

into Gemfile

and run

    bundle install

If you are using gems just

    gem install gooddata

Additional Resources
--------

Understanding GoodData API might be essential for your further work with the SDK:

 * http://developer.gooddata.com/api

This documentation lists and describes the individual resources you can used to manipulate objects on the GoodData Platform.

 * https://secure.gooddata.com/gdc

Grey Pages - allows you to interact with core and publicly available services covered by our REST APIs.