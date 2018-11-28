---
id: advanced_blueprint_examples
author: GoodData
sidebar_label: Advanced Blueprint Examples
title: Advanced Blueprint Examples
---

Using Blueprint to Update Model
------

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

In the example above we have created a new model and updated it right
away. This is not a typical situation however and there are couple of
things that you need to be aware of.

It is more common that you would like to gradually update the model in
an existing project as the new requirements arrive. For that to be
possible you have to take the "old" blueprint from some place where it
is persisted. We will show a basic way how to save a blueprint to a
file.

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

Specifying Fields Data Type
------

You can specify a different data type for attribute or fact in
a blueprint.

Each column in blueprint is eventually translated into a physical column
in a database. While the defaults are typically what you want sometimes
it might be useful to override them. You can specify the data type with
gd\_data\_type clause.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')

    p.add_dataset('dataset.commits') do |d|
      d.add_anchor('attr.commits.id')
      d.add_fact('fact.commtis.lines_changed', gd_data_type: 'integer')
  	  d.add_attribute('attr.commits.name')
      d.add_label('label.commits.name', reference: 'attr.commits.name')
      d.add_date('committed_on', :format => 'dd/MM/yyyy')
    end

    project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

    # This is going to fail since we are trying to upload 1.2 into INT numeric type
    data = [['fact.commtis.lines_changed', 'label.commits.name', 'committed_on'],
          [1.2, 'tomas', '01/01/2001']]
    project.upload(data, blueprint, 'dataset.commits')

    # This is going to pass since we are trying to upload 1 into INT numeric type
    data = [['fact.commtis.lines_changed', 'label.commits.name', 'committed_on'],
          [1, 'tomas', '01/01/2001']]
    project.upload(data, blueprint, 'dataset.commits')
  end
end
```

These data types are currently supported on the platform

-   DECIMAL(m, d)
-   INTEGER
-   LONG
-   VARCHAR(n)

The case where this is very useful are

-   if you use values from smaller domain (for example integers) you can
    leverage appropriate data type to save space and speed things up

-   if you are using facts with atypical precision (the default is
    DECIMAL(12,2)) you can leverage decimal type with larger precision

Working with Folders
------

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


Creating Project in One Page of Code
------

You can create the whole project via code. You need to have a provisioning token for project creation.


What we will do is to create a simple project with 4 datasets. Load
couple of line of data create a simple report and invite 2 other people
to it. All this will fit on one page of code. Let’s get to it.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')
    p.add_dataset('devs') do |d|
      d.add_anchor('attr.dev')
      d.add_label('label.dev_id', :reference => 'attr.dev')
      d.add_label('label.dev_email', :reference => 'attr.dev')
    end
    p.add_dataset('commits') do |d|
      d.add_anchor('attr.commits_id')
      d.add_fact('fact.lines_changed')
      d.add_date('committed_on')
      d.add_reference('devs')
    end
  end
  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: '')
  puts "Created project #{project.pid}"

  # Load data
  commits_data = [
    ['fact.lines_changed', 'committed_on', 'devs'],
    [1, '01/01/2014', 1],
    [3, '01/02/2014', 2],
    [5, '05/02/2014', 3]]
  project.upload(commits_data, blueprint, 'commits')

  devs_data = [
    ['label.dev_id', 'label.dev_email'],
    [1, 'tomas@gooddata.com'],
    [2, 'petr@gooddata.com'],
    [3, 'jirka@gooddata.com']]
  project.upload(devs_data, blueprint, 'devs')

  # create a metric
  metric = project.facts('fact.lines_changed').create_metric
  metric.save
  report = project.create_report(title: 'Awesome_report', top: [metric], left: ['label.dev_email'])
  report.save
  ['john@example.com'].each do |email|
    p.invite(email, 'admin', "Guys checkout this report #{report.browser_uri}")
  end
end
```

Using Attribute Types when Creating Project
------

You can specify certain label’s data type see [this
document](http://developer.gooddata.com/article/setting-up-data-for-geo-charts)
for more details.

You need to have a provisioning token for project creation.

We’ll create a simple project’s blueprint that contains a label with the
'GDC.link' (hyperlink) datatype in the code snippet below.

**Common types**

-   GDC.link
-   GDC.text
-   GDC.time

**Types for Geo**

-   GDC.geo.pin *(Geo pushpin)*

-   GDC.geo.ausstates.name *(Australia States (Name))*

-   GDC.geo.ausstates.code *(Australia States (ISO code))*

-   GDC.geo.usstates.name *(US States (Name))*

-   GDC.geo.usstates.geo\_id *(US States (US Census ID))*

-   GDC.geo.usstates.code *(US States (2-letter code))*

-   GDC.geo.uscounties.geo\_id *(US Counties (US Census ID))*

-   GDC.geo.worldcountries.name *(World countries (Name))*

-   GDC.geo.worldcountries.iso2 *(World countries (ISO a2))*

-   GDC.geo.worldcountries.iso3 *(World countries (ISO a3))*

-   GDC.geo.czdistricts.name *(Czech Districts (Name))*

-   GDC.geo.czdistricts.name\_no\_diacritics *(Czech Districts)*

-   GDC.geo.czdistricts.nuts4 *(Czech Districts (NUTS 4))*

-   GDC.geo.czdistricts.knok *(Czech Districts (KNOK))*

```ruby

# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Beers Project') do |p|
    p.add_date_dimension('created_at')

    # Add Breweries Dataset
    p.add_dataset('dataset.breweries', title: 'Breweries') do |d|
      d.add_anchor('attr.breweries.brewery_id', title: 'Brewery ID')
      d.add_label('label.breweries.brewery_id.brewery_id', title: 'Brewery ID', :reference => 'attr.breweries.brewery_id')
      d.add_label('label.breweries.brewery_id.name', title: 'Brewery Name', :reference => 'attr.breweries.brewery_id')
      d.add_label('label.breweries.brewery_id.link', title: 'Brewery URL', :reference => 'attr.breweries.brewery_id', :gd_type => 'GDC.link') # <--- Notice this!
      d.add_date('created_at', :dataset => 'created_at')
    end
  end

  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: 'YOUR_TOKEN_HERE')
  puts "Created project #{project.pid}"

  GoodData::with_project(project) do |p|
    # Load Brewery Data
    data = [
      %w(label.breweries.brewery_id.brewery_id label.breweries.brewery_id.name label.breweries.brewery_id.link created_at),
      [1, '21st Amendment Brewery', 'http://21st-amendment.com/', '06/23/2015'],
      [2, 'Almanac Beer Company', 'http://www.almanacbeer.com/', '06/23/2015'],
      [3, 'Anchor Brewing Company', 'http://www.anchorbrewing.com/', '06/23/2015'],
      [4, 'Ballast Point Brewing Company', 'http://www.ballastpoint.com/', '06/23/2015'],
      [5, 'San Francisco Brewing Company', 'http://www.ballastpoint.com/', '06/23/2015'],
      [6, 'Speakeasy Ales and Lagers', 'http://www.goodbeer.com/', '06/23/2015']
    ]
    GoodData::Model.upload_data(data, blueprint, 'dataset.breweries')
  end
end
```


Moving Fields in Blueprint
------

If you created a model, you can now move a field to different dataset.

We will use variation of our hr demo model. If you look at that model
you can see that we have an attribute **region** defined on departments
dataset. This is how you (hypothetically) originally created the project
and everything was fine but you realized that you would like to assign
the region to people dataset not departments dataset.

Before we start changing things spin up the project go inside the
project and create a report which show **SUM(Amount)** sliced by
**Region**.

Now let’s move the attribute between datasets.

```ruby
client = GoodData.connect
project = client.projects('PROJECT_ID')

blueprint = project.blueprint
blueprint.move!('attr.department.region', 'dataset.department', 'dataset.employee')
project.update_from_blueprint(blueprint)
```

Since we moved the attribute we have to load new data for it in the context of new dataset. The old dataset (departments) is fine since we just removed a column.


```ruby
employee_data_with_dep = [
    ['label.employee.id','label.employee.fname','label.employee.lname','dataset.department', 'label.department.region'],
    ['e1','Sheri','Nowmer','d1', 'North America'],
    ['e2','Derrick','Whelply','d2', 'Europe']
]
project.upload(employee_data_with_dep, blueprint, 'dataset.employee')
```

Now go ahead and check the original report. Yes, it is still working
fine. It gives different numbers since we changed the meaning of it but
we did not break anything.

HR Demo project
------

You can play with blueprints on this toy project. Use our HR example which models a small company and people inside
it. We tried to use majority of the features that the blueprint builder
supports so you can take it as a starting point when you are creating
yours.


```ruby
# encoding: utf-8

require 'gooddata'

# Connect to platform (using credentials in ~/.gooddata)
GoodData.with_connection do |client|

  # Create LDM blueprint
  blueprint = GoodData::Model::ProjectBlueprint.build('HR Demo Project') do |p|
    p.add_date_dimension('dataset.payment', title: 'Payment')

    p.add_dataset('dataset.department', title: 'Department', folder: 'Department & Employee') do |d|
      d.add_anchor('attr.department.id', title: 'Department ID')
      d.add_label('label.department.id', reference:'attr.department.id', title: 'Department ID')
      d.add_label('label.department.name', reference: 'attr.department.id', title: 'Department Name')
      d.add_attribute('attr.department.region', title: 'Department Region')
      d.add_label('label.department.region', reference: 'attr.department.region', title: 'Department Region')
    end

    p.add_dataset('dataset.employee', title: 'Employee', folder: 'Department & Employee') do |d|
      d.add_anchor('attr.employee.id', title: 'Employee ID')
      d.add_label('label.employee.id', title: 'Employee ID', reference:'attr.employee.id')
      d.add_label('label.employee.fname', title: 'Employee Firstname', reference:'attr.employee.id')
      d.add_label('label.employee.lname', title: 'Employee Lastname', reference:'attr.employee.id')
      d.add_reference('dataset.department')
    end

    p.add_dataset('dataset.salary', title: 'Salary') do |d|
      d.add_anchor('attr.salary.id', title: 'Salary ID', folder: 'Salary')
      d.add_label('label.salary.id', reference:'attr.salary.id', title: 'Salary ID', folder: 'Salary')
      d.add_fact('fact.salary.amount', title: 'Amount', folder: 'Salary')
      d.add_date('dataset.payment', format: 'yyyy-MM-dd')
      d.add_reference('dataset.employee')
    end
  end

  # Create new project (datamart)
  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: token)
  puts "Created project #{project.pid}"

  # Load data
  department_data = [
      ['label.department.id','label.department.name', 'label.department.region'],
      ['d1','HQ General Management', 'North America'],
      ['d2','HQ Information Systems', 'Europe']
  ]
  project.upload(department_data, blueprint, 'dataset.department')

  employee_data = [
      ['label.employee.id','label.employee.fname','label.employee.lname','dataset.department', 'label.department.region'],
      ['e1','Sheri','Nowmer','d1', 'North America'],
      ['e2','Derrick','Whelply','d2', 'Europe']
  ]
  project.upload(employee_data, blueprint, 'dataset.employee')

  employee_data_with_dep = [
      ['label.employee.id','label.employee.fname','label.employee.lname','dataset.department', 'label.department.region'],
      ['e1','Sheri','Nowmer','d1', 'North America'],
      ['e2','Derrick','Whelply','d2', 'Europe']
  ]
  project.upload(employee_data_with_dep, blueprint, 'dataset.employee')



  salary_data = [
      ['label.salary.id','dataset.employee','fact.salary.amount','dataset.payment'],
      ['s1','e1','10230','2006-01-01'], ['s2','e2','4810','2006-01-01'], ['s617','e1','10230','2006-02-01'],
      ['s618','e2','4810','2006-02-01'], ['s1233','e1','10230','2006-03-01'], ['s1234','e2','4810','2006-03-01'],
      ['s1849','e1','10230','2006-04-01'], ['s1850','e2','4810','2006-04-01'], ['s2465','e1','10230','2006-05-01'],
      ['s2466','e2','4810','2006-05-01'], ['s3081','e1','10230','2006-06-01'], ['s3082','e2','4810','2006-06-01'],
      ['s3697','e1','10230','2006-07-01'], ['s3698','e2','4810','2006-07-01'], ['s4313','e1','10230','2006-08-01'],
      ['s4314','e2','4810','2006-08-01'], ['s4929','e1','10230','2006-09-01'], ['s4930','e2','4810','2006-09-01'],
      ['s5545','e1','10230','2006-10-01'], ['s5546','e2','4810','2006-10-01'], ['s6161','e1','10230','2006-11-01'],
      ['s6162','e2','4810','2006-11-01'], ['s6777','e1','10230','2006-12-01'], ['s6778','e2','4810','2006-12-01'],
      ['s7393','e1','10440','2007-01-01'], ['s7394','e2','5020','2007-01-01'], ['s8548','e1','10440','2007-02-01'],
      ['s8549','e2','5020','2007-02-01'], ['s9703','e1','10440','2007-03-01'], ['s9704','e2','5020','2007-03-01'],
      ['s10858','e1','10440','2007-04-01'], ['s10859','e2','5020','2007-04-01'], ['s12013','e1','10440','2007-05-01'],
      ['s12014','e2','5020','2007-05-01'], ['s13168','e1','10440','2007-06-01'], ['s13169','e2','5020','2007-06-01'],
      ['s14323','e1','10440','2007-07-01'], ['s14324','e2','5020','2007-07-01'], ['s15478','e1','10440','2007-08-01'],
      ['s15479','e2','5020','2007-08-01'], ['s16633','e1','10440','2007-09-01'], ['s16634','e2','5020','2007-09-01'],
      ['s17788','e1','10440','2007-10-01'], ['s17789','e2','5020','2007-10-01'], ['s18943','e1','10440','2007-11-01'],
      ['s18944','e2','5020','2007-11-01'], ['s20098','e1','10440','2007-12-01'], ['s20099','e2','5020','2007-12-01']
  ]
  project.upload(salary_data, blueprint, 'dataset.salary')
end 
```


Refactoring datasets
------

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


Reconnect date dimension
------

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

Taking portion of a project model
------

You have a project and you would like to create a new on with the same
model but only portion of it.

Blueprints can be easily manipulated because underneath they are just
hashes of data. In the worst case you can always manipulate the hash and
create the blueprint out of that. In some cases there are helper methods
to make the code a little bit cleaner. In this example we will show an
example where we will have a blueprint with two datasets and we will
remove one of them so the new project will have just portion of the
model.

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

Playing with Computed Attributes
------

You can create a computed attribute.

Create an update blueprint that contains the computed attribute, merge
it with the current blueprint and then update the project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |project_builder|
    project_builder.add_date_dimension('created_on')

    project_builder.add_dataset('dataset.users', title: 'Users Dataset') do |schema_builder|
      schema_builder.add_anchor('attr.users.id', title: 'Users ID', folder: 'Users ID folder')
      schema_builder.add_label('label.users.id_label1', reference: 'attr.users.id')
      schema_builder.add_label('label.users.id_label2', reference: 'attr.users.id', default_label: true)
      schema_builder.add_attribute('attr.users.another_attr', title: 'Another attr')
      schema_builder.add_label('label.users.another_attr_label', reference: 'attr.users.another_attr')
      schema_builder.add_date('created_on')
      schema_builder.add_fact('fact.users.some_number')
    end
  end

  project = client.create_project_from_blueprint(blueprint, auth_token: 'token')

  metric = project.facts('fact.users.some_number').create_metric(title: 'Test')
  metric.save

  attribute = project.attributes('attr.users.another_attr')

  update = GoodData::Model::ProjectBlueprint.build("update") do |project_builder|
    project_builder.add_computed_attribute(
      'attr.comp.my_computed_attr',
      title: 'My computed attribute',
      metric: metric,
      attribute: attribute,
      buckets: [{ label: 'Low', highest_value: 1000 }, { label: 'Medium', highest_value: 2000 }, { label: 'High' }]
    )
  end

  # update the model in the project
  project.update_from_blueprint(blueprint.merge(update))

  # now you can verify there is new computed attribute present
  ca = project.attributes.find { |a| a.title == 'My computed attribute' }
  ca.computed_attribute?
end
```

In the example above we have created a computed attribute. Precondition:
have an existing metric.



