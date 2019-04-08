---
id: loading_data
author: GoodData
sidebar_label: Loading Data to Project
title: Loading Data to Project
---

Loading a Data Set to Project
-------

To load data into a project, you have to have 3 things. Blueprint, project and data.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed')
            d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :format => 'dd/MM/yyyy')
    end
  end

  project = client.create_project_from_blueprint(blueprint, auth_token: 'TOKEN')

  # By default names of the columns are the identifiers of the labels, facts, or names of references
  data = [
    ['fact.commits.lines_changed', 'label.commits.name', 'committed_on'],
    [1, 'tomas', '01/01/2001'],
    [1, 'petr', '01/12/2001'],
    [1, 'jirka', '24/12/2014']]

  project.upload(data, blueprint, 'dataset.commits')
  
  # If the column names in your data do not match the GoodData references, you can easily supply the desired mapping in the :column_mapping parameter
  data = [
    ['lines', 'committer', 'date'],
    [1, 'tomas', '01/01/2001'],
    [1, 'petr', '01/12/2001'],
    [1, 'jirka', '24/12/2014']]  
  column_mapping = {
    "fact.commits.lines_changed": 'lines',
    "label.commits.name": 'committer',
    "committed_on": 'date'
  } 
 project.upload(data, blueprint, 'dataset.commits', column_mapping: column_mapping) 

  # Now the data are loaded in. You can easily compute some number
  project.facts.first.create_metric(type: :sum).execute # => 3

  # By default data are loaded in full mode. This means that data override all previous data in the dataset
  data = [
    ['fact.commits.lines_changed', 'label.commits.name', 'committed_on'],
    [10, 'tomas', '01/01/2001'],
    [10, 'petr', '01/12/2001'],
    [10, 'jirka', '24/12/2014']]
  project.upload(data, blueprint, 'dataset.commits')
  project.facts.first.create_metric(type: :sum).execute # => 30

  # You can also load more data through INCREMENTAL mode
  project.upload(data, blueprint, 'dataset.commits', :mode => 'INCREMENTAL')
  project.facts.first.create_metric(type: :sum).execute # => 60

  # If you want to you can also specify what the names of the columns in the CSV is going to be

  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed', column_name: 'fact')
            d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name', column_name: 'label' )
      d.add_date('committed_on', :format => 'dd/MM/yyyy', column_name: 'ref')
    end
  end

  data = [
    ['fact', 'label', 'ref'],
    [10, 'tomas', '01/01/2001'],
    [10, 'petr', '01/12/2001'],
    [10, 'jirka', '24/12/2014']]
  project.upload(data, blueprint, 'dataset.commits')
end
```

Loading Multiple Data Sets to Project
-------

You can load multiple data sets into project at once.

The GoodData platform supports loading multiple datasets from a set of
CSV files in a single task. In addition to loading a single CSV at a
time, you can now upload your CSV files, provide a JSON manifest file,
and then execute the data load through a single API call. This method is
particularly useful if your project contains many datasets, or if you
are loading multiple datasets with larger data volumes. The multiple
datasets processing is significantly faster in these situations.

For more info see [GoodData
Article](http://developer.gooddata.com/article/multiload-of-csv-data).

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

Loading Data with Specific Date Format
-------

You can specify a date loading format in your blueprint. If you do not
specify any format then the default *MM/dd/yyyy* format is used

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed')
  	  d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :dataset => 'committed_on')
    end
  end

  project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

  # By default the dates are expected in format MM/dd/yyyy
  data = [
    ['fact.commits.lines_changed', 'label.commits.name', 'committed_on'],
    [1, 'tomas', '01/01/2001'],
    [1, 'petr', '12/01/2001'],
    [1, 'jirka', '12/24/2014']]
  project.upload(data, blueprint, 'dataset.commits')
  puts project.compute_report(top: [project.facts.first.create_metric], left: ['committed_on.date'])
  # prints
  #
  # [01/01/2001 | 3.0]
  # [12/01/2001 | 3.0]
  # [12/24/2014 | 3.0]

  # if you try to load a differen format it will fail
  data = [['fact.commits.lines_changed', 'label.commits.name', 'committed_on'],
          [1, 'tomas', '2001-01-01']]
  project.upload(data, blueprint, 'dataset.commits')

  # You can specify a different date format
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed')
  	  d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :dataset => 'committed_on', format: 'yyyy-dd-MM')
    end
  end

  data = [
    ['fact.commits.lines_changed', 'label.commits.name', 'committed_on'],
    [3, 'tomas', '2001-01-01'],
    [3, 'petr', '2001-01-12'],
    [3, 'jirka', '2014-24-12']]
  project.upload(data, blueprint, 'dataset.commits')
  puts project.compute_report(top: [project.facts.first.create_metric], left: ['committed_on.date'])
  # prints
  #
  # [01/01/2001 | 3.0]
  # [12/01/2001 | 3.0]
  # [12/24/2014 | 3.0]
end  
```

Note couple of things We did not have to update the project to be able
to load dates in a different format. Date format information is used
only during the data upload and the model is unaffected. This is
something to think about when you are inferring the blueprint from the
model using `project.blueprint`. This information is not persisted in
the project.
