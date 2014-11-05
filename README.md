# Red Hat Labs Angular

## Setup

```bash
rhc create-app <app name> "http://cartreflect-claytondev.rhcloud.com/reflect?github=connyay/openshift-node-diy"
```

```bash
cd <app name>
```

```bash
./init.sh -r connyay/rh-labs-angular -t 1.0.2 -n <app name>
```

## Local Development

1. Setup [accesslabsproxy](https://github.com/connyay/accesslabsproxy).
2. In a terminal start the proxy with `accesslabsproxy`
3. In another terminal navigate to your apps directory and run the following commands
  - `npm install`
  - `bower install`
  - `grunt serve`
