---
id: connecting_to_gooddata
author: GoodData
sidebar_label: Connecting to Gooddata Platform
title: Connecting to Gooddata Platform
---

Using Login and Passoword
-------

You know how to jack in and how to write a simple program. Now it is
time to combine these two to write a program that connects and does
something with a gooddata project.


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

```ruby
GoodData.with_connection(username: 'user', password: 'password')
```

Using Single Sign On (SSO)
-------

Using the SSO capability you don’t need to maintain just another
password for accessing GoodData application. You can use your existing
infrastructure for user management and connect with GoodData APIs to
allow your users login to GoodData seamlessly.

For more info check this article -
<https://developer.gooddata.com/article/single-sign-on>


```ruby
# encoding: utf-8

require 'gooddata'
require 'pp'

client = GoodData.connect_sso('tomas.korcak@gooddata.com', 'gooddata.tomas.korcak')

pp client.user.json
```

Never share the your private key with other people. It is the same thing
as you name and password. You can do almost everything with it.

Connecting to a Specific Server
-------

Sometimes the server you would like to connect is not the
secure.goodata.com machine. This might occur for 2 reasons. Either you
are trying something on a test machine (if you are working for gooddata)
or you are working with a project that is on a white labeled instance.

You can either pass the server name as a parameter to connect or
alternatively with the with\_connection functions.


```ruby
# encoding: utf-8
require 'gooddata'

GoodData.with_connection(login: 'user',
                         password: 'password',
                         server: 'https://some-other-server.com') do |client|
  # just so you believe us we are printing names of all the project under this account
  client.projects.each do |project|
    puts project.title
  end
end
```

Using Super Secure Token (SST)
-------

A Super Secure Token is a token that allows to access you our APIs in a
unrestricted manner without necessarily knowing the username and
password. Take note that currently you do not have access to the whole
API. Things like interacting with DSS and Staging Storage still need a
username and password. This issue is currently being resolved. First you
need to have SST token. There are several ways how to obtain it. Here is
one using SDK


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect(login: 'user', password: 'password')
client.connection.sst_token

# Once you have the token, you can try to login and do something.

GoodData.with_connection(sst_token: 'sst_token') do |client|
  client.projects.each do |p|
    puts p.title
  end
end 
```

Never share the token with other people. It is the same thing as your
login and password. You can do almost everything with it.


Disabling SSL Verification
-------

You would like to disable SSL verification when using SDK against a
server that does not have proper certificates

You can switch of SSL validating like this. This is especially useful
when you are using SDK against testing or development servers.

```ruby
# encoding: utf-8

require 'gooddata'

# Traditionally with login and pass
client = GoodData.connect(login: 'user', password: 'password', verify_ssl: false)

# You can also use it with SST token
client = GoodData.connect(sst_token: 'sst_token', verify_ssl: false)
```
