---
id: moving_fields_around
author: GoodData
sidebar_label: Moving fields in blueprint
title: Moving fields in blueprint
---

Goal
-------

I created a model and now found out that I would like to move a field to
different dataset.

How-to
--------

We will use variation of our hr demo model. If you look at that model
you can see that we have an attribute **region** defined on departments
dataset. This is how you (hypothetically) originally created the project
and everything was fine but you realized that you would like to assign
the region to people dataset not departments dataset.

Before we start changing things spin up the project go inside the
project and create a report which show **SUM(Amount)** sliced by
**Region**.


'src/12\_working\_with\_blueprints/moving\_fields\_around\_part1.rb'
```ruby
employee_data_with_dep = [
    ['label.employee.id','label.employee.fname','label.employee.lname','dataset.department', 'label.department.region'],
    ['e1','Sheri','Nowmer','d1', 'North America'],
    ['e2','Derrick','Whelply','d2', 'Europe']
]

```
```ruby
employee_data_with_dep = [
    ['label.employee.id','label.employee.fname','label.employee.lname','dataset.department', 'label.department.region'],
    ['e1','Sheri','Nowmer','d1', 'North America'],
    ['e2','Derrick','Whelply','d2', 'Europe']
]
project.upload(employee_data_with_dep, blueprint, 'dataset.employee')
```
Since we moved the attribute we have to load new data for it in the
context of new dataset. The old dataset (departments) is fine since we
just removed a column.

&lt;%= render\_ruby
'src/12\_working\_with\_blueprints/moving\_fields\_around\_part2.rb'
%&gt;

Now go ahead and check the original report. Yes, it is still working
fine. It gives different numbers since we changed the meaning of it but
we did not break anything.
