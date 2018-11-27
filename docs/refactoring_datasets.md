---
id: refactoring_datasets
author: GoodData
sidebar_label: Refactoring datasets
title: Refactoring datasets
---

How to work on your project. Note, this is work in progress.

Use SDK refactoring features.

Let’s have a look at two hypothetical but very common scenarios that you
probably encountered in during career.

One Dataset problem
------

Lets' say you have model like this

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build('Not so great project') do |p|
  p.add_dataset('dataset.reps', title: 'Sale Reps') do |d|
    d.add_anchor('attr.reps.id', title: 'Sales Rep')
    d.add_label('label.reps.id', reference: 'attr.reps.id', title: 'Sales Rep Name')
  end

  p.add_dataset('dataset.regions', title: 'Sale Reps') do |d|
    d.add_anchor('attr.regions.id', title: 'Sales Region')
    d.add_label('label.regions.id', reference: 'attr.regions.id', title: 'Sales Rep Name')
  end

  p.add_dataset('dataset.sales', title: 'Department') do |d|
    d.add_anchor('attr.sales.id', title: 'Sale Id')
    d.add_label('label.sales.id', reference: 'attr.sales.id', title: 'Sales tracking number')
    d.add_fact('fact.sales.amount', title: 'Amount')
    d.add_attribute('attr.sales.stage', title: 'Stage')
    d.add_label('label.sales.stage', title: 'Stage Name', reference:'attr.sales.stage')
    d.add_reference('dataset.regions')
    d.add_reference('dataset.reps')
  end
end
```

There is one problem. We should definitely extract the attribute from
'dataset.sales' dataset somewhere else. Also the anchor for this dataset
has a label. Unless we do not have specific reason for it we should
extract it somewhere else.

We can try to ask SDK to help us

```ruby
refactored_blueprint = blueprint.refactor_split_df('dataset.sales')

# Let's have a look around
refactored_blueprint.datasets.map(&:title)

refactored_blueprint.datasets.map {|d| [d.title, d.id]}
=> [["Sale Reps", "dataset.reps"],
    ["Sale Reps", "dataset.regions"],
    ["Department", "dataset.sales"],
    ["Dataset.Sales Dim", "dataset.sales_dim"]]

# So there is a new dataset
# If we print it out in repl
refactored_blueprint.datasets('dataset.sales_dim')
# prints
#
# {
#   :type=>:dataset,
#   :id=>"dataset.sales_dim",
#   :columns=>
#    [{:type=>:anchor, :id=>"vymysli_id"},
#     {:type=>:label, :id=>"label.vymysli_id", :reference=>"vymysli_id"},
#     {:type=>:attribute, :id=>"attr.sales.stage", :title=>"Stage"},
#     {:type=>:label,
#      :id=>"label.sales.stage",
#      :title=>"Stage Name",
#      :reference=>"attr.sales.stage"}]}
```

You can see that there is stage attribute right there. And it prepared
an anchor for us. The naming definitely needs touch ups (User should be
able to specify the ids somehow) but the structure is there. Now let’s
have a look what happened to sales dataset

```ruby
refactored_blueprint.datasets('dataset.sales')
# prints
#
# {:id=>"dataset.sales",
#    :type=>:dataset,
#    :columns=>
#     [{:type=>:anchor, :id=>"attr.sales.id", :title=>"Sale Id"},
#      {:type=>:label,
#       :id=>"label.sales.id",
#       :reference=>"attr.sales.id",
#       :title=>"Sales tracking number"},
#      {:type=>:fact, :id=>"fact.sales.amount", :title=>"Amount"},
#      {:type=>:reference, :dataset=>"dataset.regions"},
#      {:type=>:reference, :dataset=>"dataset.reps"},
#      {:type=>:reference, :dataset=>"dataset.sales_dim"}]
```

You can see that the attribute has gone alongside the labels. Only facts
remain. A new reference was added so the reports should still be
working. This might seem just a minor issue but once you start creating
more complex models with multiple stars you find this technique a
necessity so why not automate it?

Multiple facts in one dataset
------

Another problem we will look at is splitting fact tables because of
facts. Consider this model:

```ruby
blueprint = GoodData::Model::ProjectBlueprint.build('Not so great project') do |p|

  p.add_dataset('dataset.orders_dim', title: 'Orders Dimension') do |d|
    d.add_anchor('attr.orders_dim.id', title: 'Order')
    d.add_label('label.dataset.orders_dim.id', reference: 'attr.orders_dim.id', title: 'Order Id')
  end

  p.add_dataset('dataset.orders_fact', title: 'Orders Fact Table') do |d|
    d.add_anchor('attr.orders_fact.id', title: 'Sales Rep')
    d.add_fact('fact.dataset.orders_fact.amount_ordered', title: 'Amount Ordered')
    d.add_fact('fact.dataset.orders_fact.amount_shipped', title: 'Amount Shipped')
    d.add_reference('dataset.orders_dim')
  end
end
```

What you want to do is have a look at how many shipments were ordered
and shipped on particular day. But if you keep the facts in one dataset
you will have all kinds of trouble with nil values. Much better is to
split the fact tables in two. Again we can try doing that with SDK

Note: it seems it currently does not work with date references. We need
to update this so I omitted it in the example so it works.

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
#     {:type=>:reference, :dataset=>"dataset.orders_dim"}]}
```

These are 2 basic ways how to refactor a blueprint in an assisted and
automated fashion.
