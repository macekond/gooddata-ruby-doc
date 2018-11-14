---
id: loading_dates_format
author: GoodData
sidebar_label: Loading Data with Specific Date Format
title: Loading Data with Specific Date Format
---

Goal
-------

You need to upload dates but you have a nonstandard formatting

Solution
--------

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
