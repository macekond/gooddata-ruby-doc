---
id: using_gd_types
author: GoodData
sidebar_label: Using Attribute Types when Creating Project
title: Using Attribute Types when Creating Project
---

Goal
-------

You want to specify certain label’s data type see [this
document](http://developer.gooddata.com/article/setting-up-data-for-geo-charts)
for more details.

Before you start
-------------

You have a provisioning token for project creation.

How-to
--------

We’ll create a simple project’s blueprint that contains a label with the
'GDC.link' (hyperlink) datatype in the code snippet below.

-   GDC.link

-   GDC.text

-   GDC.time

<!-- -->

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

<!-- -->

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
