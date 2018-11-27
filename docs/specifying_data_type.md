---
id: specifying_data_type
author: GoodData
sidebar_label: Specifying Fields Data Type
title: Specifying Fields Data Type
---

You can specify a different data type for attribute or fact in
a blueprint.

Each column in blueprint is eventually translated into a physical column
in a database. While the defaults are typically what you want sometimes
it might be useful to override them. You can specify the data type with
gd\_data\_type clause.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commtis.lines_changed', gd_data_type: 'integer')
  	  d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :format => 'dd/MM/yyyy')
    end

    project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

    # This is going to fail since we are trying to upload 1.2 into INT numeric type
    data = [['fact.commtis.lines_changed', 'label.commits.name', 'committed_on'],
          [1.2, 'tomas', '01/01/2001']]
    project.upload(data, blueprint, 'dataset.commits')

    # This is going to pass since we are trying to upload 1 into INT numeric type
    data = [['fact.commtis.lines_changed', 'label.commits.name', 'committed_on'],
          [1, 'tomas', '01/01/2001']]
    project.upload(data, blueprint, 'dataset.commits')
  end
end
```

These data types are currently supported on the platform

-   DECIMAL(m, d)
-   INTEGER
-   LONG
-   VARCHAR(n)

The case where this is very useful are

-   if you use values from smaller domain (for example integers) you can
    leverage appropriate data type to save space and speed things up

-   if you are using facts with atypical precision (the default is
    DECIMAL(12,2)) you can leverage decimal type with larger precision
