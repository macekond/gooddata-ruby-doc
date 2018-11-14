---
id: connecting_to_different_server
author: GoodData
sidebar_label: Connecting to Different Servers
title: Connecting to Different Servers
---

Goal
-------

Sometimes the server you would like to connect is not the
secure.goodata.com machine. This might occur for 2 reasons. Either you
are trying something on a test machine (if you are working for gooddata)
or you are working with a project that is on a white labeled instance.

Solution
--------

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

Discussion
----------
