---
id: migrating_metadata_objects
author: GoodData
sidebar_label: Migrating objects between projects
title: Migrating objects between projects
---

Goal
-------

You have metadata objects (reports/metrics/dashboards) you would like to
transfer between projects

Example

--------


```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project = c.projects('target_project_id')


  GoodData.with_project('master_project_id') do |master_project|
```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project = c.projects('target_project_id')

  # Lets log into project you would like to transfer from  

    # find objects you would like to transfer
```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project = c.projects('target_project_id')

  # Lets log into project you would like to transfer from  
  GoodData.with_project('master_project_id') do |master_project|
    # find objects you would like to transfer
    # here we transfer all reports containing word "sales" in the title
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    begin
      token = master_project.objects_export(reports)
    rescue ObjectsExportError
      puts "Export failed"
    end
    begin
      target_project.objects_import(token)
    rescue ObjectsImportError
      puts "Import failed"
    end    
  end
end
```
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    begin
      token = master_project.objects_export(reports)
    rescue ObjectsExportError
      puts "Export failed"
    end
    begin
      target_project.objects_import(token)
    rescue ObjectsImportError
      puts "Import failed"
    end    
  end
end
```
    # here we transfer all reports containing word "sales" in the title
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    begin
      token = master_project.objects_export(reports)
    rescue ObjectsExportError
      puts "Export failed"
    end
    begin
      target_project.objects_import(token)
    rescue ObjectsImportError
      puts "Import failed"
    end    
  end
end
```

Discussion
----------

Occasionally you need to transfer objects to multiple projects. To make
it easier SDK provides a convenient method for this.

&lt;%= render\_ruby
'src/06\_working\_with\_projects/metadata\_transfer\_to\_multiple.rb'
%&gt;

Objects import happen in two stages. First you export objects with an
API call. This creates a package on our platform and provides you with a
token. You can then use the token to initiate the import. In most cases
you do not care about these details and 2 methods above are all what you
need. In some cases though you want the low level control. Here is a
quick example how to use those lower level methods.

&lt;%= render\_ruby
'src/06\_working\_with\_projects/metadata\_transfer\_low\_level.rb'
%&gt;
