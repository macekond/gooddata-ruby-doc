---
id: setting_and_updating_project_metadata
author: GoodData
sidebar_label: Setting and updating project metadata storage
title: Setting and updating project metadata storage
---

Goal
-------

You would like to use project metadata storage to store some additional
information.

Solution
--------

Each project has a small API that allows to set some values in a simple
key value manner. This is usually used for storing some information that
do not fit into the data.


```ruby
require 'gooddata'

client = GoodData.connect
project = client.projects('project_id')

# You can set some metadata
p.set_metadata('key', 'value')

# You can access the project metadata in two ways
# 
# First is to get specific key directly
p.metadata('key')
# => 'value
# In case you try to access a nonexisting key you will get 404

# Second is to access all metadata. This will return them as a Hash which you can access as usual
m = p.metadata
# => {"key"=>"value"}
m['key']
# => "value"

```
