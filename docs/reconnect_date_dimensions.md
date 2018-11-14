---
id: reconnect_date_dimensions
author: GoodData
sidebar_label: Reconnect date dimension
title: Reconnect date dimension
---

Goal
-------

Occasionally you need to reconnect date dimensions. You did all the work
on reports and last thing you are missing is to change all references in
the model from one date dimension to another.

Example

--------

With SDK you can use swap\_date\_dimension! method on blueprint. I will
give you two examples one will be with a sample blueprint created on the
fly the second will show you how to do the same on an existing project.


```ruby
# encoding: utf-8

require 'gooddata'


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
    blueprint = project.blueprint

    blueprint.swap_date_dimension!('committed_on', 'signed_on')

    # Update the project with the new blueprint
    project.update_from_blueprint(blueprint)
  end
end
```

The change in operating on an existing project is the same. The only
difference is how you acquire the blueprint.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/date\_dim\_ref\_swap\_2.rb' %&gt;
