---
id: working_with_lifecycle
author: GoodData
sidebar_label: Working with Lifecycle
title: Working with Lifecycle
---

Life-cycle Segments
------

You can setup and execute a life-cycle management
configuration to distribute new versions of dashboards, reports, and
metrics from a master template to multiple target projects.

You can use life-cycle management API to create a life-cycle segment,
associate it with its master template project, and populate the segment
with target projects that are going to receive the new versions of
objects from the master template. First let’s align on the terminology.

Organization - Organization is an object that contains all users and
projects that you or your company have provisioned to the GoodData
platform. Organization can also contain white-labeling configuration
(your custom colors, logos, URLs etc.). Lifecycle management segments
and projects are always set up within an organization.

Lifecycle segment represents a group of projects that contain the same
analytical objects. New versions of these objects can be distributed
from so called master template project to the segment’s projects. The
segment’s projects can also contain ad-hoc objects (e.g. reports or
metrics) that are not touched (not updated nor deleted) by the lifecycle
processes. Lifecycle segments are usually used to represent a different
tiers (e.g. bronze/silver/gold) tiers of an analytical solution.

Master template is a project that contains the latest and greatest
versions of objects that are distributed to the segment’s projects. We
recommend to keep the master’s project immutable once it gets associated
with a segment. So a new master template project should be cloned from
the previous master and associated with the segment for each new version
of your solution. Lifecycle segment can be associated with just one
master at any given time.

Client - is user-assigned ID of a segment’s project. The client ID is
associated with a GoodData generated project ID during segment
provisioning operation. The client ID is stable identification of
certain tenant’s project. It can be associated with different project
IDs during it’s lifecycle.

Having defined some terminology we present code that will do several
things.

-   sets up a segment with master project (along with some data and
    dashboard)

-   creates a client within a segment. The client is not yet associated
    with a project at this time.

-   releases new master project

-   provisions new project for the client (this will ensure client’s
    project has the same model, dashboard but no data )

-   changes the dashboard in master

-   makes another release

-   synchronizes the clients with updated version

-   adds a client

-   provisions new project for the second client too


```ruby
require 'gooddata'

TOKEN = 'token'
PASSWORD = 'pass'

# Connect to GoodData a specific organization's (aka domain's) URL
client = GoodData.connect('mustang@gooddata.com', PASSWORD, server: 'https://mustangs.intgdc.com', verify_ssl: false )
# Organization (aka domain)
domain = client.domain('mustangs')

seq_number = 8

# Prepare master project
# ======================

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

# Create the master template project
project = client.create_project_from_blueprint(blueprint, auth_token: TOKEN)
puts "Created master template project #{project.pid}"

# Load data
department_data = [
    ['label.department.id','label.department.name', 'label.department.region'],
    ['d1','HQ General Management', 'North America'],
    ['d2','HQ Information Systems', 'Europe']
]
project.upload(department_data, blueprint, 'dataset.department')

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

# Create a report within the master template project
metric = project.facts('fact.salary.amount').create_metric
metric.save
report = project.create_report(title: 'My report', left: ['label.department.name'], top: [metric])

# Create a dashboard within the master template project
dashboard = project.create_dashboard(:title => 'Test Dashboard')
tab = dashboard.create_tab(:title => 'Tab Title #1')
tab.title = 'Test #42'
item = tab.add_report_item(:report => report, :position_x => 10, :position_y => 20)
item.position_x = 400
item.position_y = 300
dashboard.lock
dashboard.save

# Create new lifecycle segment
# ============================

segment = domain.create_segment(segment_id: "segment_#{seq_number}", master_project: project)

# Release the segment
# ===================
segment.synchronize_clients


# Create new client
# =================
segment_client = segment.create_client(id: "client_#{seq_number}")


# Provision new project for the client
# ====================================
domain.provision_client_projects

# The new project contains all the objects from the master template
segment.clients.first.project.pid
# => aerkc6562oiauaof9mxtowcc4fl5vwb4
segment.clients.first.project.metrics.count
# => 1
segment.clients.first.project.dashboards.first.title
# => 'Test Dashboard'

# The client project should not have any data from master
segment.master_project.metrics.first.execute
# => 0.366E6
segment.clients.first.project.metrics.first.execute
# => nil

# Update master and propagate changes
# ===================================

# Now let's change something in our master.
# Let's change a title in master and transfer to the clients
dashboard.title = 'Better Test Dashboard'
dashboard.save

# Release the segment and synchronize clients
segment.synchronize_clients

# Check the results in the client's project
segment.clients.first.project.dashboards.first.title
# => "Better Test Dashboard"

# Add additional clients
# ======================
#
# This is it. Just for illustration let's create another client. This basically just means repeating the flow.
# We already have our master prepared so let's just create a new client.
another_segment_client = segment.create_client(id: "client_#{seq_number + 1}")

# currently there should be only one project for the first client
segment.clients.map { |c| [c.id, c.project_uri]}
# => [["client_8", "/gdc/projects/aerkc6562oiauaof9mxtowcc4fl5vwb4"], ["client_9", nil]]

# Let's provision project. This will provision it with project from last call of 'domain.synchronize_clients'
domain.provision_client_projects

# Let's check we have a project
segment.clients.map { |c| [c.id, c.project_uri]}
# => [["client_8", "/gdc/projects/aerkc6562oiauaof9mxtowcc4fl5vwb4"], ["client_9", "/gdc/projects/yxpp45hf39bigezp3ug8pm6kc9h6tihv"]]

# Let's also verify that we have a latest version. The new project should contain the updated version of the dashboard beacuse we've already released it via 'synchonize_clients'
segment.clients("client_#{seq_number + 1}").project.dashboards.first.title
# => "Better Test Dashboard"
```

Organizing Segments into Data Products
------

You can encapsule multiple segments into a data product for
better granularity.

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
