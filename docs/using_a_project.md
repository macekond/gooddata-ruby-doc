---
id: using_a_project
author: GoodData
sidebar_label: Using Project
title: Using Project
---

Goal
-------

You want to use a specific project

Solution
--------

You can use couple of ways to do this. Our favorite is this


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    puts project.title
  end
```

This has a benefit that you have access to project only inside the
block. Once the block is left you are 'disconnected to the project. If
you are using several projects in one script this is a way to go to be
sure you are not reaching somewhere you do not want to.

There are other more conventional ways to do the same thing. &lt;%=
render\_ruby
'src/01\_getting\_started/using\_a\_project\_with\_connection.rb' %&gt;
