---
id: creating_project_from_blueprint
author: GoodData
sidebar_label: Creating Project from Blueprint
title: Creating Project from Blueprint
---

Goal
-------

You would like to create a new project with a data model
programmatically.

Solution
--------


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

Discussion
----------

Let’s have a look at couple of other variations and more complex
examples.

### Defining identifiers

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

    p.add_dataset('dataset.users')

It means that later you would be able to do

    project.datasets('dataset.users') # this will search all the datasets and returns you the one with identifier 'dataset.users'.

Similarly

    d.add_fact('fact.users.some_number')

will result into you be able to do

    project.facts('fact.users.some_number') # this will search all the facts and returns you the one with identifier 'fact.users.some_number'.

Identifier can be anything. The only condition is that it has to be

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')


```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')
  end
end

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')

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

project.facts('fact.users.amount').title # => 'Amount Sold'
```
```
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')
  end
end

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
```
how you assign the identifiers.

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build("My project from blueprint") do |p|
  p.add_date_dimension('created_on')

  p.add_dataset('dataset.users') do |d|
    d.add_anchor('attr.users.id')
    d.add_date('created_on')
    d.add_fact('fact.users.amount', title: 'Amount Sold')
  end
end


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
end

project.facts('fact.users.amount').title # => 'Amount Sold'
```
discuss separately.

### Defining attributes

When you define attributes through add\_attribute you have to remember
to add at least one label to that particular attribute

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part2.rb' %&gt;

You can do it like this

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part3.rb' %&gt;

### Defining anchors/connection\_points

Since you might argue that anchor (you might also hear term connection
point which means the same thing) is a special case of the attribute
lets' talk about it a little. Yes it is true but there are additional
things that make it that special one. There can be only one anchor in
each dataset

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part4.rb' %&gt;

An anchor allows you to reference from other datasets. To do this you
must first define a label. Anchors can have multiple labels the same as
an attribute. We strongly recommend not to define an anchor with labels
on fact tables (they are usually not referenced). The only exception to
this rule is if you need to upsert data.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part5.rb' %&gt;

A good question is "why you have to define the anchor if it has no
labels?". The reason is that you still need the underlying attribute if
you want to construct the count metric for fact table to answer question
"How many lines there is in the 'dataset.sales' dataset?". You can do
this as follows with the SDK (with previous model).

    project.attributes("attr.sales.id").create_metric.execute

### Defining date dimensions

Dimensions in all tools and even in MAQL date are represented as a
single unit (as in blueprint builder add\_date\_dimension). This is
great for readability but can be misleading. The fact is that date
dimension has several datasets that typically contain ~18 attributes. It
is probably not surprising that the parameter to 'add\_date\_dimension'
is not an identifier but a name that is used in titles and identifiers
of all attributes. It is also a name that you can use in add\_date
function. For example:

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part6.rb' %&gt;

You can easily create a fiscal date dimension with a specific urn. For
example:

    p.add_date_dimension('created_on', urn: 'urn:pe:date')

### Defining references

Typically in your model you need to reference other datasets. This is
expressed in the blueprint builder with add\_reference function. It
takes only one parameter which is the identifier of referenced dataset.
References do not have identifier since they are not represented as
objects on the platform.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part7.rb' %&gt;

### Defining date references

This is very similar to references but there is additional hint that you
are referencing date dimension.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part8.rb' %&gt;

### Defining Titles

If you would build and open in the browser any of the models we built up
to this point you probably noticed that the titles look off. Since we
did not define anything SDK tries to do the right thing and tries to use
the identifiers (with some tweaking for readability) as titles. While
this might work it is usually not what you want. You can easily fix that
by defining the titles explicitly.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/creating\_project\_part9.rb' %&gt;

### Specifying data types

Occasionally the default data types of the fields will not be what you
want. You can redefine them for both labels and facts as expected with
parameter :gd\_data\_type. There is more information about this in a
following recipe.
