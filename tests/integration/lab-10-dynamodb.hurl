# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

Content-Type: application/json

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Sending json data
{ "service": "DynamoDB" }

# We expect to get back an HTTP 201
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Asserts]

# The Location header should look (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.['fragment']['id']"


################################################

# 2. Try to GET the fragment we just posted by its URL
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8 

[Asserts]
jsonpath "$.status" == "ok"


##################################################

GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We should get back an HTTP 1.1 200 response
HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments[*].id" includes "{{fragment1_id}}"


##################################################

DELETE {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

# We should get back an HTTP 1.1 200 response
HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"

##################################################


# 2. Try to GET the fragment we just posted by its URL
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404


##################################################


GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# We should get back an HTTP 1.1 200 response
HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"