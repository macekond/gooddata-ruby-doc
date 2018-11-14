---
id: cloning_project
author: GoodData
sidebar_label: Cloning Project
title: Cloning Project
---

Goal
-------

You would like to create an exact copy of a project

Example

--------

You can use cloning capabilities.


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.projects('project_pid')
cloned_project = project.clone(title: 'New title',
                               auth_token: 'token',
                               users: false,
                               data: true,
                               exclude_schedules: true,
                               cross_data_center_export: true)
```

Discussion
----------

There are four options that you can specify. You can pick if you want to
clone just metadata (e.g. attributes, facts, metrics reports, dashboards
etc.) or also data (this is default). Also you can choose if you want to
transfer all old project’s users to the new project. No users are
transferred by default. In the example above we explicitly specified the
*users* and *data* optional parameters so you can see how it works.
Setting the exclude\_schedules to true causes scheduled emails to be
omitted from the transfer. The cross\_data\_center\_export specifies
whether the export can be used in any data center.
