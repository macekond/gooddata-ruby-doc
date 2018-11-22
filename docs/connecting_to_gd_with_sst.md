---
id: connecting_to_gd_with_sst
author: GoodData
sidebar_label: Using Super Secure Token (SST)
title: Using Super Secure Token (SST)
---

Connecting to GoodData Platform
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
