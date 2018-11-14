---
id: work_with_results
author: GoodData
sidebar_label: Working with report results
title: Working with report results
---

Goal
-------

You have computed a report now you would like to get dirty with the data

Example

--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    # first let's create a metric and give it a reasonable identifier so we can read the examples
    m1 = project.facts('fact.salary.amount').create_metric
    result = project.compute_report(left: [m1, 'dataset.payment.quarter.in.year'],
                            top: ['attr.department.region'])

    # You can print the result
    puts result
    # [   |               | Europe | North America]
    # [Q1 | sum of Amount | 29490  | 62010        ]
    # [Q2 | sum of Amount | 29490  | 62010        ]
    # [Q3 | sum of Amount | 29490  | 62010        ]
    # [Q4 | sum of Amount | 29490  | 62010        ]

    # You can get size of report
    result.size # => [5, 4]

    # this gives you the overall size but you probably want to also know the
    # size of the data portion
    result.data_size # => [4, 2]

    # you can learn if it is empty which comes handy for reports without data
    result.empty? # => false

    # You can access data as you would with matrix
    result[0][3] # => "North America"
    result[2] # ["Q2", "sum of Amount", "29490", "62010"]

    # You can ask questions about contents
    result.include_row? ["Q4", "sum of Amount", "29490", "62010"] # => true
    result.include_column? ["Europe", "29490", "29490", "29490", "29490"] # => false

    # this is fine but there is a lot fo clutter caused byt the headers. The library provides you with methods to get only slice of the result and creates a new result
    # Let's say I would like to get just data
    puts result.slice(1, 2)
    # [29490 | 62010]
    # [29490 | 62010]
    # [29490 | 62010]
    # [29490 | 62010]

    # This is a worker method that is used to implement several helpers
    # Previous example is equivalent with this
    puts result.data

    puts result.without_top_headers
    # [Q1 | sum of Amount | 29490 | 62010]
    # [Q2 | sum of Amount | 29490 | 62010]
    # [Q3 | sum of Amount | 29490 | 62010]
    # [Q4 | sum of Amount | 29490 | 62010]

    puts result.without_left_headers
    # [Europe | North America]
    # [29490  | 62010        ]
    # [29490  | 62010        ]
    # [29490  | 62010        ]
    # [29490  | 62010        ]

    # All of those are again results so everything above works as expected
    result.data.include_row? ["29490", "62010"] # => true

    # There are several other methods that might make your life easier. Consider the following
    result.diff result.without_top_headers
    # {
    #   :added => [],
    #    :removed => [[nil, nil, "Europe", "North America"]],
    #    :same => [["Q1", "sum of Amount", "29490", "62010"],
    #              ["Q2", "sum of Amount", "29490", "62010"],
    #              ["Q3", "sum of Amount", "29490", "62010"],
    #              ["Q4", "sum of Amount", "29490", "62010"]]
    # }

  end
end
```
