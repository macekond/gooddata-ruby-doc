---
id: using_a_project
author: GoodData
sidebar_label: Using Project
title: Using Project
---

Specifying Your Project
-------

You can use couple of ways to do this. Our favorite is this:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    puts project.title
  end
end
```

This has a benefit that you have access to project only inside the
block. Once the block is left you are 'disconnected to the project. If
you are using several projects in one script this is a way to go to be
sure you are not reaching somewhere you do not want to.

There are other more conventional ways to do the same thing: 

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  project = GoodData.use('project_pid')
  puts project.title
end
```
