---
id: refactoring_datasets
author: GoodData
sidebar_label: Refactoring datasets
title: Refactoring datasets
---

Goal
-------

You created a quick prototype but you found out that it needs some
touching up.

Notes
-----

This is work in progress.

How-to

--------

Use SDK refactoring features.

Let’s have a look at two hypothetical but very common scenarios that you
probably encountered in during career.

### "One Dataset problem"

Lets' say you have model like this


```ruby
# you define which dataset you would like to split. Secnd parameter is list of facts you would like to move and the last one is the id of the new dataset
refactored_blueprint = blueprint.refactor_split_facts('dataset.orders_fact', ['fact.dataset.orders_fact.amount_shipped'], 'dataset.orders_shipped_fact')

# Again Let's explore
refactored_blueprint.datasets.count # => 3

refactored_blueprint.datasets.map {|d| [d.title, d.id]}
# => [["Orders Dimension", "dataset.orders_dim"],

```ruby
# you define which dataset you would like to split. Secnd parameter is list of facts you would like to move and the last one is the id of the new dataset
refactored_blueprint = blueprint.refactor_split_facts('dataset.orders_fact', ['fact.dataset.orders_fact.amount_shipped'], 'dataset.orders_shipped_fact')

# Again Let's explore
refactored_blueprint.datasets.count # => 3


```ruby
# you define which dataset you would like to split. Secnd parameter is list of facts you would like to move and the last one is the id of the new dataset
refactored_blueprint = blueprint.refactor_split_facts('dataset.orders_fact', ['fact.dataset.orders_fact.amount_shipped'], 'dataset.orders_shipped_fact')

# Again Let's explore
refactored_blueprint.datasets.count # => 3

refactored_blueprint.datasets.map {|d| [d.title, d.id]}
# => [["Orders Dimension", "dataset.orders_dim"],
#     ["Orders Fact Table", "dataset.orders_fact"],
#     ["Dataset.Orders Shipped Fact", "dataset.orders_shipped_fact"]]

# There is a new dataset "dataset.orders_shipped_fact"

```ruby
# you define which dataset you would like to split. Secnd parameter is list of facts you would like to move and the last one is the id of the new dataset
refactored_blueprint = blueprint.refactor_split_facts('dataset.orders_fact', ['fact.dataset.orders_fact.amount_shipped'], 'dataset.orders_shipped_fact')

# Again Let's explore
refactored_blueprint.datasets.count # => 3

refactored_blueprint.datasets.map {|d| [d.title, d.id]}
# => [["Orders Dimension", "dataset.orders_dim"],
#     ["Orders Fact Table", "dataset.orders_fact"],

```ruby
# you define which dataset you would like to split. Secnd parameter is list of facts you would like to move and the last one is the id of the new dataset
refactored_blueprint = blueprint.refactor_split_facts('dataset.orders_fact', ['fact.dataset.orders_fact.amount_shipped'], 'dataset.orders_shipped_fact')

# Again Let's explore
refactored_blueprint.datasets.count # => 3

refactored_blueprint.datasets.map {|d| [d.title, d.id]}
# => [["Orders Dimension", "dataset.orders_dim"],
#     ["Orders Fact Table", "dataset.orders_fact"],
#     ["Dataset.Orders Shipped Fact", "dataset.orders_shipped_fact"]]

# There is a new dataset "dataset.orders_shipped_fact"
refactored_blueprint.datasets('dataset.orders_shipped_fact')
# prints
# 
# {
#   :id=>"dataset.orders_shipped_fact",
#   :type=>:dataset,
#   :columns=> [
#     {:type=>:anchor, :id=>"dataset.orders_shipped_fact.id"},
#     {:type=>:fact,
#      :id=>"fact.dataset.orders_fact.amount_shipped",
#      :title=>"Amount Shipped"},
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}```
# There is a new dataset "dataset.orders_shipped_fact"
refactored_blueprint.datasets('dataset.orders_shipped_fact')
# prints
# 
# {
#   :id=>"dataset.orders_shipped_fact",
#   :type=>:dataset,
#   :columns=> [
#     {:type=>:anchor, :id=>"dataset.orders_shipped_fact.id"},
#     {:type=>:fact,
#      :id=>"fact.dataset.orders_fact.amount_shipped",
#      :title=>"Amount Shipped"},
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}```
# 
# {
#   :id=>"dataset.orders_shipped_fact",
#   :type=>:dataset,
#   :columns=> [
#     {:type=>:anchor, :id=>"dataset.orders_shipped_fact.id"},
#     {:type=>:fact,
#      :id=>"fact.dataset.orders_fact.amount_shipped",
#      :title=>"Amount Shipped"},
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}```
#     ["Orders Fact Table", "dataset.orders_fact"],
#     ["Dataset.Orders Shipped Fact", "dataset.orders_shipped_fact"]]

# There is a new dataset "dataset.orders_shipped_fact"
refactored_blueprint.datasets('dataset.orders_shipped_fact')
# prints
# 
# {
#   :id=>"dataset.orders_shipped_fact",
#   :type=>:dataset,
#   :columns=> [
#     {:type=>:anchor, :id=>"dataset.orders_shipped_fact.id"},
#     {:type=>:fact,
#      :id=>"fact.dataset.orders_fact.amount_shipped",
#      :title=>"Amount Shipped"},
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}```

# There is a new dataset "dataset.orders_shipped_fact"
refactored_blueprint.datasets('dataset.orders_shipped_fact')
# prints
# 
# {
#   :id=>"dataset.orders_shipped_fact",
#   :type=>:dataset,
#   :columns=> [
#     {:type=>:anchor, :id=>"dataset.orders_shipped_fact.id"},
#     {:type=>:fact,
#      :id=>"fact.dataset.orders_fact.amount_shipped",
#      :title=>"Amount Shipped"},
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}```

There is one problem. We should definitely extract the attribute from
'dataset.sales' dataset somewhere else. Also the anchor for this dataset
has a label. Unless we do not have specific reason for it we should
extract it somewhere else.

We can try to ask SDK to help us

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/refactoring\_part2.rb' %&gt;

You can see that there is stage attribute right there. And it prepared
an anchor for us. The naming definitely needs touch ups (User should be
able to specify the ids somehow) but the structure is there. Now let’s
have a look what happened to sales dataset

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/refactoring\_part3.rb' %&gt;

You can see that the attribute has gone alongside the labels. Only facts
remain. A new reference was added so the reports should still be
working. This might seem just a minor issue but once you start creating
more complex models with multiple stars you find this technique a
necessity so why not automate it?

### Multiple facts in one dataset

Another problem we will look at is splitting fact tables because of
facts. Consider this model:

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/refactoring\_part4.rb' %&gt;

What you want to do is have a look at how many shipments were ordered
and shipped on particular day. But if you keep the facts in one dataset
you will have all kinds of trouble with nil values. Much better is to
split the fact tables in two. Again we can try doing that with SDK

Note: it seems it currently does not work with date references. We need
to update this so I omitted it in the example so it works.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/refactoring\_part5.rb' %&gt;

These are 2 basic ways how to refactor a blueprint in an assisted and
automated fashion.
