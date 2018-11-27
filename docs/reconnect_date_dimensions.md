---
id: reconnect_date_dimensions
author: GoodData
sidebar_label: Reconnect date dimension
title: Reconnect date dimension
---

Occasionally you need to reconnect date dimensions. You did all the work
on reports and last thing you are missing is to change all references in
the model from one date dimension to another.

With the SDK you can use swap\_date\_dimension! method on blueprint. I will
give you two examples one will be with a sample blueprint created on the
fly the second will show you how to do the same on an existing project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')
    p.add_date_dimension('signed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commits.lines_changed')
            d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :format => 'dd/MM/yyyy')
    end
  end

  # Let's check that there are some references really pointing to committed_on dimension
  # and none to signed_on dimension

  blueprint.datasets.flat_map(&:references).map(&:reference).include?('committed_on')
  # => true
  blueprint.datasets.flat_map(&:references).map(&:reference).include?('signed_on')
  # => false

  # let's swap all the references
  blueprint.swap_date_dimension!('committed_on', 'signed_on')

  # Now if we check we see that there is no reference to committed_on dimension
  blueprint.datasets.flat_map(&:references).map(&:reference).include?('committed_on')
  # => false
  blueprint.datasets.flat_map(&:references).map(&:reference).include?('signed_on')
  # => true
end
```

The change in operating on an existing project is the same. The only
difference is how you acquire the blueprint.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    blueprint = project.blueprint

    blueprint.swap_date_dimension!('committed_on', 'signed_on')

    # Update the project with the new blueprint
    project.update_from_blueprint(blueprint)
  end
end
```