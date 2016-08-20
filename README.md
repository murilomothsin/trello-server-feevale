# trello-server-feevale

## Rotas

### GET /users
response:
```
[
  {
    "_id": "57b78e100b16e0570f6abc2a"
    "name": "Murilo"
    "email": "murilo@email.com"
  },
  {
    "_id": "vfb78e199b16e0057f6absdf"
    "name": "Maria"
    "email": "maria@email.com"
  }
]
```
### GET /users/:id
response
```
{
  "user": {
    "_id": "57b7cedc1c873ff1166a34a6"
    "name": "Murilo"
    "email": "murilo@email.com"
  }
}
```
### POST /sign_in
request:
```
{"username": "murilo", "password": "1234"}
```
response
```
{
  "token": "iasjdoijsdoijsadioj9832j289je892j3djqsjt982j34r", 
  "user": {
    "_id": "57b78e100b16e0570f6abc2a",
    "name": "Murilo",
    "username": "murilo",
    "email": "murilo@email.com"
  }
}
```
### POST /users/sign_up
request
```
{
  "name":"Murilo", 
  "username": "murilo", 
  "password": "1234", 
  "email": "murilo@email.com"
}
```
response
```
{
  "__v": 0
  "name": "Murilo"
  "username": "murilo"
  "password": "$2a$05$7zAtE4aEVT.3Z8cUsDHNmekVdREDTdRKMyQHkBJ4sngYD5QaxBgY2"
  "email": "murilo@email.com"
  "_id": "57b7cedc1c873ff1166a34a6"
}
```
### POST /users/valid_token
request
```
{
  token: "oakdopaskdpoksaopdkaospkd4123423423"
}
```
response
```
{
  "user": {
    "_id": "57b7cedc1c873ff1166a34a6"
    "name": "Murilo"
    "email": "murilo@email.com"
  }
}
```
