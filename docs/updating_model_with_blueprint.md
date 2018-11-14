---
id: updating_model_with_blueprint
author: GoodData
sidebar_label: Adding New LDM Fields to Project
title: Adding New LDM Fields to Project
---

Goal
-------

You would like to update a project with additional fields

Example

--------

Blueprints are easy to create programmatically and even to merge them
together. In this example we will create a simple blueprint with one
dataset and then add an additional field into blueprint and update the
model.


```ruby
# encoding: utf-8

require 'gooddata'

BLUEPRINT_FILE = 'blueprint_file.json'


GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    blueprint = GoodData::Model::ProjectBlueprint.from_json(BLUEPRINT_FILE)
    update = GoodData::Model::ProjectBlueprint.build('update') do |p|
      p.add_dataset('repos') do |d|
        d.add_attribute('region')
      end
    end
    new_blueprint = blueprint.merge(update)
    unless new_blueprint.valid?
	    pp new_blueprint.validate
	    fail "New blueprint is not valid"
    end
    project.update_from_blueprint(new_blueprint)
    # now you can look at the model and verify there is new attribute present
    project.attributes.find {|a| a.title == 'Region'}
    new_blueprint.store_to_file(BLUEPRINT_FILE)

  end
end
```

Discussion
----------

In the example above we have created a new model and updated it right
away. This is not a typical situation however and there are couple of
things that you need to be aware of.

It is more common that you would like to gradually update the model in
an existing project as the new requirements arrive. For that to be
possible you have to take the "old" blueprint from some place where it
is persisted. We will show a basic way how to save a blueprint to a
file.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/updating\_project\_2.rb' %&gt;
