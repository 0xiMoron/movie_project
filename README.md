## What my general goals were

I wanted to make a simple SPA app where I could interchangably switch "Tabs" by just updating the DOM and keeping everything pretty light

I also broke down a lot of the business logic into Util files and let the components only hold functions that are event handlers for buttons and alerts to make the code as readable as possible

## What I wish I could have done differently

1. Currently, I regret not starting in TypeScript and making strict models for specific types of data
   I wanted to make a Movie model and have everything that would change that movies state (ex: the check if the movie had been watched or not yet) in function inside the model itself and easily calling them when needed

The only reason I didnt change to TypeScript is that I had initially intended to test the API in JavaScript and switch but as I moved deeper and deeper into the logic it seemed easier to just continue in JS rather than switch it up all of a sudden

2. I think I will eventually do this, but I feel that my app is kinda half react half nothing and I want to bring it together in a better package

Is it using React in all the pages? sure, but there are a lot of features and designs that I could use from react that would make life a lot easier that I just havent implemented yet

3. At the moment I only have one giant Style file. This isnt typically how I make my apps, but I kept adding to it out of convenience... I will split it up as I continue to fix the project

## Future features I want to bring to the table

- I want to fix the alert so that it shows up under the pressed card
- Filters on each page to display the data by Alpabetical order, Review, etc
- A share button! (Maybe use public apis like Discord or Twitter)
- Themes! Like dark mode or light
- Add TV Search options!

## Running the app!

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
