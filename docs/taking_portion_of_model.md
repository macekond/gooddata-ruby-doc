---
id: taking_portion_of_model
author: GoodData
sidebar_label: Taking portion of a project model
title: Taking portion of a project model
---

Problem
-------

You have a project and you would like to create a new on with the same
model but only portion of it.

Solution
--------

Blueprints can be easily manipulated because underneath they are just
hashes of data. In the worst case you can always manipulate the hash and
create the blueprint out of that. In some cases there are helper methods
to make the code a little bit cleaner. In this example we will show an
example where we will have a blueprint with two datasets and we will
remove one of them so the new project will have just portion of the
model.


'src/12\_working\_with\_blueprints/removing\_dataset\_from\_blueprint.rb'
```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|

  # This is a blueprint
  # We could grab it from live project via project.blueprint but we will just
  # create it inline so we do not have to spin up additional project

  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed')
  	  d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :dataset => 'committed_on')
    end

    p.add_dataset('dataset.commits2') do |d|
      d.add_anchor('attr.commits.id2')
      d.add_fact('fact.commits.lines_changed2')
  	  d.add_attribute('attr.commits.name2')
      d.add_label('label.commits.name2', reference: 'attr.commits.name2')
      d.add_date('committed_on', :dataset => 'committed_on')
    end
  end

  # Now we need to manipulate it so it contains only portion of the model we want.
  # In this case we want just dataset 'dataset.commits'.
  # Take note that the project can be succesfully created only from a valid blueprint
  # You can always check if the blueprint is valid by calling blueprint.valid?
  #

  # Let's remove the dataset
  # We are going to user method remove_dataset! which means the blueprint will be changed in place
  # You can also use remove_dataset in which case a new blueprint will be created and the old one will
  # not be touched
  blueprint.remove_dataset!('dataset.commits2')

  # Let's create a project based on the
  project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

  # You can verify that the created project has only two datasets
  project.datasets.map(&:identifier)
  # => ["dataset.commits", "committed_on.dataset.dt"]

end
```
