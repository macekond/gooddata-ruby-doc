---
id: playing_with_computed_attributes
author: GoodData
sidebar_label: Playing with Computed Attributes
title: Playing with Computed Attributes
---

You can create a computed attribute.

Create an update blueprint that contains the computed attribute, merge
it with the current blueprint and then update the project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |project_builder|
    project_builder.add_date_dimension('created_on')

    project_builder.add_dataset('dataset.users', title: 'Users Dataset') do |schema_builder|
      schema_builder.add_anchor('attr.users.id', title: 'Users ID', folder: 'Users ID folder')
      schema_builder.add_label('label.users.id_label1', reference: 'attr.users.id')
      schema_builder.add_label('label.users.id_label2', reference: 'attr.users.id', default_label: true)
      schema_builder.add_attribute('attr.users.another_attr', title: 'Another attr')
      schema_builder.add_label('label.users.another_attr_label', reference: 'attr.users.another_attr')
      schema_builder.add_date('created_on')
      schema_builder.add_fact('fact.users.some_number')
    end
  end

  project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

  metric = project.facts('fact.users.some_number').create_metric(title: 'Test')
  metric.save

  attribute = project.attributes('attr.users.another_attr')

  update = GoodData::Model::ProjectBlueprint.build("update") do |project_builder|
    project_builder.add_computed_attribute(
      'attr.comp.my_computed_attr',
      title: 'My computed attribute',
      metric: metric,
      attribute: attribute,
      buckets: [{ label: 'Low', highest_value: 1000 }, { label: 'Medium', highest_value: 2000 }, { label: 'High' }]
    )
  end

  # update the model in the project
  project.update_from_blueprint(blueprint.merge(update))

  # now you can verify there is new computed attribute present
  ca = project.attributes.find { |a| a.title == 'My computed attribute' }
  ca.computed_attribute?
end
```

In the example above we have created a computed attribute. Precondition:
have an existing metric.
