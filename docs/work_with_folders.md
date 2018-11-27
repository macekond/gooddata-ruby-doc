---
id: work_with_folders
author: GoodData
sidebar_label: Working with Folders
title: Working with Folders
---

You can use folders for organizing your project’s model.

By default all the attributes and facts are automatically assigned a
folder based on it’s dataset name. This name is either generated from
the dataset’s name or title (if defined). You can override this default
and specify your own folder for any field.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build("my_blueprint") do |p|
    p.add_dataset('dataset.reps', title: 'Awesome Sales Reps') do |d|
      d.add_anchor('attr.reps.id')
      d.add_label('label.reps.id', reference: 'attr.reps.id')
      d.add_attribute('attr.reps.name')
      d.add_label('label.reps.name', reference: 'attr.reps.name')
    end

    p.add_dataset('dataset.regions') do |d|
      d.add_anchor('attr.regions.id')
      d.add_label('label.regions.id', reference: 'attr.regions.id')
      d.add_attribute('attr.regions.name')
      d.add_label('label.regions.name', reference: 'attr.regions.name')
    end

    p.add_dataset('dataset.opportunities') do |d|
      d.add_anchor('attr.opportunities.id')
      d.add_fact('fact.amount', folder: 'My Special Folder')
      d.add_reference('dataset.reps')
      d.add_reference('dataset.regions')
    end
  end

  project = client.create_project_from_blueprint(blueprint, auth_token: 'token_id')

  # Currently there is not support in SDK to directly explore folders but we can reach to API directly
  # You can also go to the project in your browser and look for folders there
  client.get("#{project.md['query']}/dimensions")['query']['entries'].map {|i| i['title']} # => ["Dataset.Opportunities", "Awesome Sales Reps", "Dataset.Regions"]

  client.get("#{project.md['query']}/folders")['query']['entries'].map {|i| i['title']} # => ["My Special Folder"]
end
```

Folders are not removed. If you would publish a model that doesn’t
contain an existing folder, the folder isn’t automatically removed (it
is empty).
