const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
const fs = require('fs');
const app = express();
const port = 3001;
const recipes = require('./RecipesCopy');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/recipes", function(req, res){
    res.send(recipes);
});

app.post("/SaveRecipe", function(req, res){
    var recipeName = req.body.recipeName;
    var recipeDescription = req.body.recipeDescription;
    var ingredients = [];
    var ingredientNames = req.body.ingredientName;
    var ingredientTypes = req.body.ingredientType;
    var ingredientQuantities = req.body.ingredientQuantity;
    var ingredientUnits = req.body.ingredientUnit;
    var steps = [];
    for (var i = 0; i < ingredientNames.length; i++){
        var ingredient = {
            id: i,
            name: ingredientNames[i],
            type: ingredientTypes[i],
            quantity: ingredientQuantities[i],
            unit: ingredientUnits[i],
        }
        ingredients.push(ingredient);
    }
    var recipe = {
        id: null,
        name: recipeName,
        description: recipeDescription,
        ingredients: ingredients,
        steps: steps
    }
    var data = fs.readFileSync('RecipesCopy.json');
    var json = JSON.parse(data);
    var maxId = -1;
    for (var i = 0; i < json.recipes.length; i++){
        if (json.recipes[i].id > maxId){
            maxId = json.recipes[i].id;
        }
    }
    recipe.id = maxId + 1;
    recipes.recipes.push(recipe);
    json.recipes.push(recipe);
    fs.writeFile("RecipesCopy.JSON", JSON.stringify(json, null, "\t"), function(err) {
        if (err){
            console.log("An error has occurred.");
        }   
    });
    res.redirect("/Home");
});

app.listen(port, function(){
    console.log("Recipe App Backend listening on port: " + port);
});

