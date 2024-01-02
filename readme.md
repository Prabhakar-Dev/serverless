# A home for Serverless Lambda functions

These should run in the background, probably on a schedule.

Currently, it's just aggregations, but there's currently no reason why we'd want to
create separate applications for non-aggregation scheduled calculations, caching, etc.

## Structure

- `serverless.yml` defines the lambdas and their schedules
  (note that there's an allAggregations that you can use locally,
  but doesn't run on a schedule so as not to be duplicative)
- So that this stuff doesn't have to pollute anything below the top level ...
    - `handlers.ts` wraps regular TypeScript functions as AWS Lambda Handlers
    - `runnable-aggregations.ts` injects the Mongo connection data

## How to use it

It uses the same .env.local that other applications use for a connection string.

```
npm i

# make some fake data locally so you have something to run aggregations against
npm run generate-fake-data

# execute a lamba locally
npm run local [functionName]

# make sure your code changes compile and lint
npm run build
npm run lint
```

### For running HTTP functions locally via cURL:

Parameters for each endpoint are as follows

##### endpoints: queryFlagCountPerRuleAndApplication, queryFlagCountPerApplication, queryFlagAndWordCountPerEnterprise, queryFlagCountPerRule, queryUniqueEndpointCountPerEnterprise, queryFlagAndWordAndUniqueEndpointCountPerEnterprise
Parameters:
- periodStartUnixTimeUtcMs: starting timestamp of the first time block to fetch results for
- timeBucketDurationMs: how long each time bucket should be (aggregates are currently cached in incremements of 15 minutes, so it should be a multiple of 15 minutes)
- totalBuckets: how many time buckets to return
- enterpriseId: the enterpriseId to filter to

##### endpoint: queryFlagRepetitionRatioPerEnterprise
All the above parameters, plus ...
- repetitionTimeSpanSeconds: how many seconds should be considered a repetition?
- repetitionOccurrencesThreshold: (optional, default 1) how many times does the violation need to be repeated?
  Ignore anything repeated fewer than [repetitionOccurrencesThreshold] times (within [repetitionTimeSpanSeconds])

```
npm run local-http

# show me the counts of words and flags each hour, for 24 hours
curl --location --request POST 'localhost:3000/queryFlagAndWordCountPerEnterprise' \
      --header 'Content-Type: application/json' \
      --data-raw '{"periodStartUnixTimeUtcMs": 1640934000000, "timeBucketDurationMs": 3600000, "totalBuckets": 24, "enterpriseId": "000000000000000000000016"}'

# for each day in the week, show me when the same rule was violated by the same person 10 times in an hour
curl --location --request POST 'localhost:3000/queryFlagRepetitionRatioPerEnterprise' \
      --header 'Content-Type: application/json' \
      --data-raw '{"repetitionOccurrencesThreshold": 10, "repetitionTimeSpanSeconds": 3600, "periodStartUnixTimeUtcMs": 1640934000000, "timeBucketDurationMs": 86400000, "totalBuckets": 7, "enterpriseId": "000000000000000000000016"}'

```

### SLS Scripts 
 ```
 serverless:package:function <nameOfTheFunction>
 ``` 
 expects `nameOfTheFunction` as parameter and then tries to package the specified function only, using the local install of serverless.  

 ```
 serverless:invoke-local <nameOfTheFunction>
 ```

expects `nameOfTheFunction` as parameter and then tries to invoke locally the specified function only using the local install of serverless.  

```
serverless:invoke-local:enterpriseDefaults
```
expects parameters for `enterpriseDefaults` in JSON format (`--data` sls option), then tries to invoke the `enterpriseDefaults` function locally, using the local install of serverless.
(if you need to pass parameters to your function, you can look at this example to make your own)