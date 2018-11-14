---
id: data_products
author: GoodData
sidebar_label: Working with data products
title: Working with data products
---

Goal
-------

You would like to encapsule multiple segments into a data product for
better granularity.

Solution
--------

This solution is based on the terminology and examples presented in
chapter regarding [Segments](#01_wip_segments.asciidoc).

This code will do several things:

-   sets up a segment in the legacy way, referencing no dataproduct

-   sets up another segment as a part of a dataproduct

-   shows that the segments are only included in the specific
    dataproduct that was used to create them


```ruby
# Create a data product
custom_data_product = domain.create_data_product(id: 'data-product')
# Create new lifecycle segment without referencing a data product
first_segment = domain.create_segment(segment_id: 'segment-1', master_project: project)
# the API defaults the data product to 'default', which should be present in all domains
# that means the above call is equal to
default_data_product = domain.data_products('default')
default_data_product.create_segment(segment_id: 'segment-1', master_project: project)
# Create another segment as a part of the data product
second_segment = custom_data_product.create_segment(segment_id: 'segment-2', master_project: project)
# the first_segment is then only present in the default_data_product
default_data_product.segments.find { |s| s.segment_id == first_segment.segment_id }
# => #<DataProduct:#>
# and not present in the custom_data_product we created
custom_data_product.segments.find { |s| s.segment_id == first_segment.segment_id }
# => nil
```
