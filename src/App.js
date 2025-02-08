import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [input, setInput] = useState("");
  const [results, setresults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [onResultClick, setOnResultClick] = useState(false);
  const [cache, setCache] = useState({});
  const [recipe, setRecipe] = useState("")

  const onClickHandle = (inputID) => {
    const recipeResult = results.filter(r => r.id === inputID);
    setRecipe(recipeResult[0]);
    setShowResults(false);
  }


  async function fetchData() {
    if (input.length === 0) {
      return;
    }
    if (cache[input]) {
      console.log("Cache Data: " + input)
      setresults(cache[input])
      return;
    }


    const data = await fetch('https://dummyjson.com/recipes/search?q=' + input);
    const json = await data.json();

    setresults(json?.recipes);
    setCache(prev => (
      { ...prev, [input]: json?.recipes }
    ))
  }

  useEffect(() => {

    const timer = setTimeout(() => {
      fetchData()
    }, 300);

    return () => {
      clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [input])

  return (
    <div className="App">
      <div>
        <h1>Autocomplete Searchbar</h1>
        <h4>Search for any Recipe</h4>
        <input
          type="text"
          className='search-bar'
          placeholder={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => { !onResultClick ? setShowResults(true) : setShowResults(false) }}
        />
      </div>
      {
        showResults && input.length !== 0 &&
        <div className='result-container'>
          {results.map((r) => <p key={r.id} onFocus={() => setOnResultClick(true)} onClick={() => { onClickHandle(r.id) }} className='result'>{r.name}</p>)}
        </div>
      }
      {
        recipe &&
        <div>
          <h3>{recipe.name}</h3>
          <div className='recipe-container'>
            <div className='ingredients'>
              <h5>Ingredients</h5>
              <ol>
                {recipe ? recipe?.ingredients.map((i, index) => <li key={index}>{i}</li>) : <></>}
              </ol>
            </div>
            <div className='instructions'>
              <h5>Instructions</h5>
              <p>{recipe.instructions}</p>
            </div>
          </div>
        </div>
      }

    </div>
  );
}

export default App;
