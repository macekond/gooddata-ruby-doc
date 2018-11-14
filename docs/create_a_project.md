---
id: create_a_project
author: GoodData
sidebar_label: Creating Empty Project
title: Creating Empty Project
---

Goal
-------

You need to create a project programmatically.

Example
--------


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.create_project(title: 'My project title', auth_token: 'PROJECT_CREATION_TOKEN')

# after some time the project is created and you can start working with it
puts project.uri
puts project.title # => 'My project title'
```
