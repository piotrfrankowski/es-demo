# es-example

`yarn start`, then call server:

```
curl 'localhost:3838/pay' -H 'content-type: application/json' -d '{"amount":0.3, "recepient":"0x1", "token":"ETH", "user":"0x2"}'
curl 'localhost:3838/history?user=0x1' -s | jq
curl 'localhost:3838/balance?user=0x1' -s | jq
curl 'localhost:3838/bank' -s | jq
```

`yarn db UUID` to read events related to the given request