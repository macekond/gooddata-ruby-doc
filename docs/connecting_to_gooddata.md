---
id: connecting_to_gooddata
author: GoodData
sidebar_label: Connecting to Gooddata Platform
title: Connecting to Gooddata Platform
---

Goal
-------

You know how to jack in and how to write a simple program. Now it is
time to combine these two to write a program that connects and does
something with a gooddata project.

Example

--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
    # just so you believe us we are printing names of all the project under this account
    client.projects.each do |project|
        puts project.title
    end
end 
```

Discussion
----------

Maybe you are wondering if there are other ways how to log in. First of
all it is not nice to have secret credentials in plain text like this.
SDK has one feature to help you. If `GoodData.with_connection` or
`GoodData.connect` is called without any params it tries to find the
param file that contains these credentials. Currently it looks for
~/.gooddata and expects it to have following content

    {
      "username": "john@example.com",
      "password": "pass",
      "auth_token": "token"
    }

You do not have to create it yourself. Run `gooddata auth store` and a
wizard is going to help you.

Also it is possible to pass parameters as hash. The form that we have
shown is just a convenience form.

      GoodData.with_connection(username: 'user', password: 'password')
