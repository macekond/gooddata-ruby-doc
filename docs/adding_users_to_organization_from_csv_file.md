---
id: adding_users_to_organization_from_csv_file
author: GoodData
sidebar_label: Adding Multiple Users to Organization from CSV
title: Adding Multiple Users to Organization from CSV
---

Goal
-------

You would like to add a users to organization programmatically. What you
have is a CSV file holding the information about the users.

Before you start
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

We assume that you have a file with details handy. The file can look for
example like this

    login,first_name,last_name,password
    john@example.com,John,Doe,12345678

The headers we used are defaults. If you have different ones you will
have to do some mangling. Minimal information that you have to provide
for the user creation to be successful is login.

How-to
--------

First let’s have a look how to implement an addition with having the
file as in the example above. This has the advantage that you do not
have to mangle with the headers.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect

headers = ["UserLogin", "FirstName", "LastName", "UserPassword"]
new_headers = [:login, :first_name, :last_name, :password]

domain = client.domain('domain-name')
users = []
CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
  new_data = new_headers.zip(row.to_hash.values_at(*headers))
  users << Hash[new_data]
end

domain.create_users(users)


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect

headers = ["UserLogin", "FirstName", "LastName", "UserPassword"]
new_headers = [:login, :first_name, :last_name, :password]

domain = client.domain('domain-name')
users = []
CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
  new_data = new_headers.zip(row.to_hash.values_at(*headers))
  users << Hash[new_data]
end

domain.create_users(users)
```
system has different headers than would be ideal. One possible thing you
can do is to transform it in a separate ETL process or you can change
the code slightly to compensate. In the next code snippet we will show
you how to do just that.

Imagine you have a file like this

    UserLogin,FirstName,LastName,UserPassword
    john@example.com,John,Doe,12345678

Notice that it is exactly the same information as before. The only
difference is that you have different headers.

This is the code add those users to a domain.

&lt;%= render\_ruby
'src/02\_working\_with\_users/users\_to\_domain\_from\_csv\_header\_mangle.rb'
%&gt;

Notice that the bulk of the code is the same. The only differences are
that we defined `headers` which contain the values of the headers in the
CSV file provided. Variable `new_headers` provide the corresponding
values for those headers that the SDK expects. Take not that the
position is important and the headers for corresponding columns has to
be in the same order in both variables.

The most important line in the code is this

    new_headers.zip(row.to_hash.values_at(*headers))

What it does is it exchanges the keys from `headers` to those defined in
`new_headers`. This code does not return a Hash but array of key value
pairs. This can be turned into a hash with this

    Hash[*new_data]

The rest of the code is the same as in previous example.
