---
id: renaming_project
author: GoodData
sidebar_label: Renaming Project
title: Renaming Project
---

Problem
-------

You need to rename the project.

Solution
--------


```ruby
require 'gooddata'

client = GoodData.connect
project = client.projects('project_id')
project.title = "New and much better title"
project.save
```
