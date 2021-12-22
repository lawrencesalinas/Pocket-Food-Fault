
# FoodVault

## UserStories

Search for restaurants information using  a zipcode anywhere in the country. Food Vault gives the users the ability to see information about a restaurant's hours, address, menu items or item pricing.

users can also add or delete a restaurant  profile to save the hassle of searching for information about their favorite restaurants. users can also leave a review about their expereience about  a restaurant and also see other users reviews. if the user had a change of heart about the restaurant, an edit a review functionality is available.

## tech stack
+ Javascript
+ Express
+ Node.js
+ CSS
+ ejs
+ Sequelize
+ postgres
+ axios
+ ejs-layouts

## API to use
+ Documenu API

|METHOD| URL pattern | Action(CRUD) | 
| -----| ----------- | ------ | 
| GET | `/restaurants`| Index(Read)     |              
| GET | `/restaurants/:id`|Show(Read)              |
| POST |`/restaurants` |Create(Create)        |              
| GET  |`/reviews/:id`|Index(Read)       |              
| POST  |`/reviews/:id`|Create(create)       |              
| GET  |`/reviews/edit/:id`|Edit(Read)       |           
| PUT  |`/reviews/:id`|Update(Update)       |             
| PUT  | `profile/restaurants`| Index(Read)      |              
| DELETE  | `profile/restaurants/:id`| Index(Read) |              



## Models
+ user 
+ restaurants
+ userRestaurants
+ reviews


## MVP

+ create a page where  user is able to search for restaurants using a zipcode.
+ create page to render list of restaurants results.
+ render detailed information of restaurants.
+ users who signed up will have the ability to add or remove restaurants to a page of favorites.
+ users who are signed up will have the ability to add a review
+ create links to go  to the  home page and profile page.

## Stretch
+ add menus and pricing.
+ add geolocation to locate restaurants.

!<img width="1000" alt="Screen Shot 2021-12-13 at 4 06 10 AM" src="https://user-images.githubusercontent.com/22379194/145783206-e6cf058c-0c98-4cab-b8e5-1c0129b98d67.png">



