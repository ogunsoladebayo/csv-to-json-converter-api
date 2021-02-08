# CSV to JSON converter

  >single express API endpoint route [HTTP POST] that accepts the following payload

## Usage
 - endpoint: send POST request to [CSV to JSON](https://butternut-valuable-dawn.glitch.me/)
 - sample request:
 ```{
  "csv":{
    "url": "https://linktocsv.csv",
    "select_fields": ["First Name", "Last Name", "Age"] //optional,
  }
}
```
