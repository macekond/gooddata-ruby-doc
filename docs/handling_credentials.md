---
id: handling_credentials
author: GoodData
sidebar_label: Handling Credentials Securely
title: Handling Credentials Securely
---

How-to
--------
When you decide to share your scripts, you should extract your credentials to
a separate file that is not shared.

There is fairly easy solution that you can use. If you recall correctly
there is a way how you can log in into platform.

```ruby
GoodData.connect(login: 'user', password: 'password')
```

This takes several types of parameters one of which is a hash of values.
You can leverage that and read the hash from a file. There a many
variants we are going to show 2 most popular ones, YAML and JSON.

### JSON

Create a file that looks like this.

```json
{
  "login" : "john@gooddata.com",
  "password" : "my_secret"
}
```

Then use it this way:

```ruby
params = JSON.parse(File.read('/path/to/file'))
client = GoodData.connect(params)
puts client.projects.count
```

### YAML

Create a file that looks like this.

```yaml
login: john@gooddata.com
password: my_secret
```

Then use it this way:

```ruby
require 'yaml'

params = YAML.load(File.read('/path/to/file'))
client = GoodData.connect(params)
puts client.projects.count
```

You see that you can easily share these scripts with other people since
you have externalized all sensitive information. If the user puts the
configuration file in an expected place everything will work. There are
other formats and ways you can leverage this but the idea is always the
same.

This is actually something we do behind the scenes if you do not specify
any params into connect or with\_connection. We look at ~/.gooddata for
a JSON file and use what we find there. This is extremely useful when
you are showing things interactively so you do not have to disclose your
credentials. You can either go and create the file by hand or you can
use a convenience method we have created for you. Just call gooddata
auth store and you will be asked couple of questions and the file will
be created for you.
