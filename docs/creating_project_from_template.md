---
id: creating_project_from_template
author: GoodData
sidebar_label: Creating Project from Template
title: Creating Project from Template
---

Problem
-------

You have a template created for you and you would like to spin a project
from this template.

Solution
--------


'src/06\_working\_with\_projects/create\_project\_from\_template.rb'
```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.create_project(title: 'New project',
                                template: '/projectTemplates/SuperSoda/1/',
                                auth_token: 'token')
```

Discussion
----------

Note that people behind SDK do not endorse usage of templates so
consider it being here for legacy purposes.
