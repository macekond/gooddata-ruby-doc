---
id: creating_project_from_blueprint
author: GoodData
sidebar_label: Creating Project from Blueprint
title: Creating Project from Blueprint
---

Using Blueprint to Create a Project
----------

You can create a new project with a data model programmatically.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')
  end
end

project.facts('fact.users.amount').title # => 'Amount Sold'
```

This created a project with very simple model with just two datasets.
One is date dimension. The other is a typical fact table. For another
more complex example check out the "Working with HR Demo project" recipe
which uses many of the features we will explain here.

Let’s have a look at couple of other variations and more complex
examples.

Defining Identifiers
----------

Majority of the objects defined in a blueprint will end up as object in
metadata server in the project. Each of these objects has its URI,
object id (this number is part of the URI) and identifier which is a
textual id. URI and object id are created automatically during creation
of a model and you cannot influence them in any way but you have to
define the identifiers. This is also the first parameter in majority of
the add\_…​ commands. Namely

    add_anchor
    add_label
    add_dataset
    add_fact
    add_attribute

When you see this in the blueprint

```ruby
p.add_dataset('dataset.users')
```

It means that later you would be able to do

```ruby
project.datasets('dataset.users') # this will search all the datasets and returns you the one with identifier 'dataset.users'.
```

Similarly

```ruby
d.add_fact('fact.users.some_number')
```

will result into you be able to do

```ruby
project.facts('fact.users.some_number') # this will search all the facts and returns you the one with identifier 'fact.users.some_number'.
```

Identifier can be anything. The only condition is that it has to be unique in the context of a project. No 2 objects may have the same identifier. That being said it is useful to have some kind of convention how you assign the identifiers.

Exception to this rule are references and date_references which we will discuss separately.

Defining Attributes
----------

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_attribute('attr.users.name')
  end
end

blueprint.valid? # => false
blueprint.validate # => [{:type=>:attribute_without_label, :attribute=>"attr.users.name"}]
```

You can do it like this:

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_attribute('attr.users.name')
    d.add_label('label.users.name.full_name', reference: 'attr.users.name')
    d.add_label('label.users.name.abbreviated_name', reference: 'attr.users.name')
  end
end

blueprint.valid? # => true
blueprint.validate # => []
```

Defining anchors/connection_points
----------

Since you might argue that anchor (you might also hear term connection
point which means the same thing) is a special case of the attribute
lets' talk about it a little. Yes it is true but there are additional
things that make it that special one. There can be only one anchor in
each dataset:

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_anchor('attr.users.id2')
  end
end

blueprint.valid? # => false
blueprint.validate # => [{:type=>:more_than_on_anchor, :dataset=>"dataset.users"}]
```

An anchor allows you to reference from other datasets. To do this you
must first define a label. Anchors can have multiple labels the same as
an attribute. We strongly recommend not to define an anchor with labels
on fact tables (they are usually not referenced). The only exception to
this rule is if you need to upsert data.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_label('label.users.id', reference: 'attr.users.id')
    d.add_attribute('attr.users.name')
    d.add_label('label.users.name.full_name', reference: 'attr.users.name')
  end

  p.add_dataset('dataset.sales') do |d|
    d.add_anchor('attr.sales.id')
    d.add_fact('fact.sales.amount')
    d.add_reference('dataset.users')
  end
end

blueprint.valid? # => true
```

A good question is "why you have to define the anchor if it has no
labels?". The reason is that you still need the underlying attribute if
you want to construct the count metric for fact table to answer question
"How many lines there is in the 'dataset.sales' dataset?". You can do
this as follows with the SDK (with previous model).

```ruby
project.attributes("attr.sales.id").create_metric.execute
```

Defining date dimensions
----------

Dimensions in all tools and even in MAQL date are represented as a
single unit (as in blueprint builder add\_date\_dimension). This is
great for readability but can be misleading. The fact is that date
dimension has several datasets that typically contain ~18 attributes. It
is probably not surprising that the parameter to 'add\_date\_dimension'
is not an identifier but a name that is used in titles and identifiers
of all attributes. It is also a name that you can use in add\_date
function. For example:

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_fact('fact.users.some_number')
    d.add_date('created_on')
  end
end
```

You can easily create a fiscal date dimension with a specific urn. For
example:

```ruby
p.add_date_dimension('created_on', urn: 'urn:pe:date')
```

Defining references
----------

Typically in your model you need to reference other datasets. This is
expressed in the blueprint builder with add\_reference function. It
takes only one parameter which is the identifier of referenced dataset.
References do not have identifier since they are not represented as
objects on the platform.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_attribute('attr.users.name')
    d.add_label('attr.users.name.full_name', reference: 'attr.users.name')
  end

  p.add_dataset('dataset.sales') do |d|
    d.add_anchor('attr.sales.id')
    d.add_fact('fact.sales.amount')
    d.add_reference('dataset.users')
  end
end

blueprint.valid? # => true
```

Defining date references
----------

This is very similar to references but there is additional hint that you
are referencing date dimension.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.some_number')
  end
end
```

Defining Titles
----------

If you would build and open in the browser any of the models we built up
to this point you probably noticed that the titles look off. Since we
did not define anything SDK tries to do the right thing and tries to use
the identifiers (with some tweaking for readability) as titles. While
this might work it is usually not what you want. You can easily fix that
by defining the titles explicitly.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')
  end
end

project.facts('fact.users.amount').title # => 'Amount Sold'
```

Specifying data types
----------

Occasionally the default data types of the fields will not be what you
want. You can redefine them for both labels and facts as expected with
parameter :gd\_data\_type. There is more information about this in a
following recipe.

Getting Blueprint from Existing Project
-------

Sometimes, you need to reverse engineer a blueprint from an existing project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    blueprint = project.blueprint

    # now you can start working with it
    blueprint.datasets.count # => 3
    blueprint.datasets(:all, include_date_dimensions: true).count # => 4
    blueprint.attributes.map(&:title)

    # You can also store it into file as json
    blueprint.store_to_file('model.json')
  end
end
```
