---
id: report_with_lines_in_datasets
author: GoodData
sidebar_label: Creating Report that Counts Records in All Datasets
title: Creating Report that Counts Records in All Datasets
---

Problem
-------

Occasionally you need to know how many rows there are in each dataset.

Solution
--------

This is surprisingly difficult to do in GoodData UI but it is simple
with SDK. Here we are going to create the necessary metrics on the fly
through inspection of a blueprint. Then we will create a report that
will contain those metrics and compute it.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    blueprint = project.blueprint

    # let's grab anchor on each dataset. Anchor is a special attribute on each dataset
    # this attribute defines the grain of the dataset if we "count" it we will get the number of lines
    # in the dataset
    anchors = blueprint.datasets.map(&:anchor)

    # As is explained in Blueprint section. Objects in blueprint are project agnostic.
    # Let's find corresponding attribute object in specific project
    attributes = anchors.pmap { |anchor| anchor.in_project(project) }

    # Lets create a report on the fly that is going to have the metrics in the rows
    # Take note that this is a real report on the platform that could be saved and alter reused
    puts project.compute_report(left: attributes.map(&:create_metric))

    # This might result into something like this
    #
    # [                                                            |   Values   ]
    # [count of Records of timeline                                | 0.7306E4   ]
    # [count of Activity                                           | 0.61496E6  ]
    # [count of Opportunity                                        | 0.85171E6  ]
    # [count of Product                                            | 0.5E1      ]
  end
end
```
