---
id: looking_up_metadata_objects
author: GoodData
sidebar_label: Looking up metadata objects
title: Looking up metadata objects
---

Problem
-------

You would like to retrieve metadata objects (e.g. metrics, facts,
labels) by numeric ID, string identifier or URI.

Solution
--------

Use `GoodData::MdObject#[]` to look up your metadata objects. This
method is aliased `#get_by_id`.


'src/06\_working\_with\_projects/looking\_up\_metadata\_objects.rb'
```ruby
options = { project: project, client: client }
id = metric.obj_id
# => "2258"
GoodData::MdObject[id, options].class
# => GoodData::Metric

identifier = metric.identifier
# => "metric.total.claim.amount"
GoodData::MdObject[identifier, options].class
# => GoodData::Metric

uri = metric.uri
# => "/gdc/md/zlf5mgyd1txaztohukv8xwv1jjm28zvg/obj/2258"
GoodData::MdObject[uri, options].class
# => GoodData::Metric
```
