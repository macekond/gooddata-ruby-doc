---
id: loading_data
author: GoodData
sidebar_label: Loading Data to Project
title: Loading Data to Project
---

Goal
-------

You would like to load data into project.

Example

--------

To load data you have to have 3 things. Blueprint, project and data.


```ruby
# encoding: utf-8

require 'gooddata'
require 'csv'

USERNAME = 'YOUR_USERNAME'
PASSWORD = 'YOUR_PASSWORD'
TOKEN = 'YOUR_TOKEN'

GoodData.with_connection(USERNAME, PASSWORD) do |client|
  # Create LDM blueprint
  blueprint = GoodData::Model::ProjectBlueprint.from_json('data/hr_manifest.json')

  # Create new project (datamart)
  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: TOKEN)
  puts "Created project #{project.pid}"

  data = [
    {
      data: 'data/hr_departments.csv',
      dataset: 'dataset.department',
    },
    {
      data: 'data/hr_employees.csv',
      dataset: 'dataset.employee'

```ruby
# encoding: utf-8

require 'gooddata'
require 'csv'

USERNAME = 'YOUR_USERNAME'
PASSWORD = 'YOUR_PASSWORD'
TOKEN = 'YOUR_TOKEN'

GoodData.with_connection(USERNAME, PASSWORD) do |client|
  # Create LDM blueprint
  blueprint = GoodData::Model::ProjectBlueprint.from_json('data/hr_manifest.json')

  # Create new project (datamart)
  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: TOKEN)
  puts "Created project #{project.pid}"

  data = [
    {
      data: 'data/hr_departments.csv',
      dataset: 'dataset.department',
    },
    {
      data: 'data/hr_employees.csv',
      dataset: 'dataset.employee'
    },
    {
      data: 'data/hr_salaries.csv',
      dataset: 'dataset.salary',
      options: {:mode => 'INCREMENTAL'}
    }
  ]
  res = project.upload_multiple(data, blueprint)

  puts JSON.pretty_generate(res)

  puts 'Done!'
end
```
      data: 'data/hr_salaries.csv',
      dataset: 'dataset.salary',
      options: {:mode => 'INCREMENTAL'}
    }
  ]
  res = project.upload_multiple(data, blueprint)

  puts JSON.pretty_generate(res)

  puts 'Done!'
end
```

Loading Multiple Data Sets to Project
=====================================

Goal
-------

You would like to load multiple data sets into project at once.

How-to

--------

The GoodData platform supports loading multiple datasets from a set of
CSV files in a single task. In addition to loading a single CSV at a
time, you can now upload your CSV files, provide a JSON manifest file,
and then execute the data load through a single API call. This method is
particularly useful if your project contains many datasets, or if you
are loading multiple datasets with larger data volumes. The multiple
datasets processing is significantly faster in these situations.

For more info see [GoodData
Article](http://developer.gooddata.com/article/multiload-of-csv-data).

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/loading\_multiple\_data.rb' %&gt;
