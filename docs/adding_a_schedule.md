---
id: adding_a_schedule
author: GoodData
sidebar_label: Scheduling Process
title: Scheduling Process
---

Problem
-------

You have a process deployed and you would like to add a schedule to it
so the process is executed regularly

Solution
--------

You can easily add a time based schedule to any process. Scheduled
process execution has couple advantages over the ad-hoc process
executions. Scheduled executions are logged and logs are kept around for
some time (~10 days). Also schedule keeps list of parameters so you
create it once and you do not need to care about them anymore.


```ruby
data = <<JSON_DATA
{
  "param_1" : {
    "deeper_key" : "value_1"
  },
  "param_2" : "value_2"
}
JSON_DATA


# Note that <<JSON_DATA and JSON_DATA marks the beginning and the end of the string. Once we have the JSON string defined we can use JSON libraries to convert it. Here we are using MultiJson which is part fo the Ruby SDK.

params = MultiJson.load(data)
=> {"param_1"=>{"deeper_key"=>"value_1"}, "param_2"=>"value_2"}```

Working with JSON
-----------------

In many examples in the Appstore, the parameters are specified in JSON.
JSON is language agnostic that is very similar to Ruby format of
representing data but it is not exactly the same. Since here we are
working in Ruby we present a short example how to convert JSON to Ruby
automatically.

Let’s assume we have some JSON parameters that look like this

    {
      "param_1" : {

```ruby
data = <<JSON_DATA
{
  "param_1" : {
    "deeper_key" : "value_1"
  },
  "param_2" : "value_2"
}
JSON_DATA


# Note that <<JSON_DATA and JSON_DATA marks the beginning and the end of the string. Once we have the JSON string defined we can use JSON libraries to convert it. Here we are using MultiJson which is part fo the Ruby SDK.

params = MultiJson.load(data)
=> {"param_1"=>{"deeper_key"=>"value_1"}, "param_2"=>"value_2"}```
      "param_2" : "value_2"
    }

We first need to store this in a string and then use one of the ruby
libraries to convert this to the equivalent on Ruby language. Typically
there are problems with the quotes since in many language a string
literal is defined with " and thus the JSON need to be escaped. Another
problem might be caused with the fact that JSON is typically on multiple
lines (as in our example). We use one of the lesser known features of
ruby called HEREDOC to help us. It is basically a way to define a string
that is potentially on multiple lines without worrying about escaping.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/json\_params\_conversion.rb' %&gt;

Then we can use it as in the example above
