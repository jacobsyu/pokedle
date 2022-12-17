import { useState } from "react";

async function handleHints(guessedPokemon, correctType, correctAtk, correctDef, correctHt, correctWt) {
    // Fetech data for the guessed Pokemon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${guessedPokemon}`);
    // If the Pokemon does not exist then return an error
    if (response.status == 404) {
        return 'error';
    }

    const data = await response.json();

    // Store stats of the guesed Pokemon for comparison
    let guessedType = [];
    for (let i = 0; i < data.types.length; i++) {
        guessedType[i] = data.types[i].type.name;
    }
    let guessedAtk = data.stats[1].base_stat;
    let guessedDef = data.stats[2].base_stat;
    let guessedHt = data.height;
    let guessedWt = data.weight;

    // Iterate through the types of the guessed Pokemon and add it to a correctly guessed
    // types array if it is correct
    let correctlyGuessedTypes = [];
    let index = 0;
    for (let i = 0; i < guessedType.length; i++) {
        if (correctType.includes(guessedType[i])) {
            correctlyGuessedTypes[index] = guessedType[i];
            index++;
        }
    }

    // Compare the difference in guessed Pokemon and actual Pokemon
    let atkDiff = guessedAtk - correctAtk;
    let defDiff = guessedDef - correctDef;
    let htDiff = guessedHt - correctHt;
    let wtDiff = guessedWt - correctWt;

    // Return objects as a dictionary to use in the hint display
    return {
        guessedPokemon: guessedPokemon,
        correctlyGuessedTypes: correctlyGuessedTypes,
        atkDiff: atkDiff,
        defDiff: defDiff,
        htDiff: htDiff,
        wtDiff: wtDiff
    };
}

// Parameters are passed in from App.js component
function UserInput({correctAnswer, correctType, correctAtk, correctDef, correctHt, correctWt, image}) {
    const [attemptNumber, setAttemptNumber] = useState(0);
    const [validPokemon, setValidPokemon] = useState(true);

    // Constantly save the value of the guess as it is being typed, the value is saved
    // everytime a key is pressed
    const [guess, setGuess] = useState('');
    const handleChange = (event) => {
        setGuess(event.target.value);
    }

    // Upon pressing the submit button, run an event and check if the word entered is a
    // valid Pokemon name. If the name is not valid, then set validPokemon to false and use
    // this to send a warning message. If the Pokemon is valid, set the stat differentials
    // and increment attempt number.
    const [statDiff, setStatDiff] = useState();
    const onSubmit = async (event) => {
        if (await handleHints(guess.toLowerCase(), correctType, correctAtk, correctDef, correctHt, correctWt) === 'error') {
            setValidPokemon(false);
            return;
        }
        setStatDiff(await handleHints(guess.toLowerCase(), correctType, correctAtk, correctDef, correctHt, correctWt))
        setValidPokemon(true);
        setAttemptNumber(attemptNumber + 1);
    }

    // A lot of CSS styling and logic.
    return <div>
        <input type="text" name="Guess" id="UserGuess" style={{
            backgroundColor: "rgb(58, 58, 60)",
            color: "white",
            border: "2px rgb(58, 58, 60)",
            borderRadius: "10px",
            width: "200px",
            height: "50px",
            fontSize: "2rem",
            textAlign: 'center',
            verticalAlign: 'middle'
        }} value={guess} onChange={handleChange}/>
        {(statDiff == undefined || (statDiff && statDiff.guessedPokemon !== correctAnswer)) && attemptNumber < 6 &&
            <button type="submit" style={{verticalAlign: 'middle', border: '0', background: 'transparent'}} onClick={onSubmit}>
                <img src="./submitbutton.png" width='50px' height='50px'/></button>}
        {!validPokemon && <p>Not a Pokemon, please check spelling.</p>}
        {statDiff && statDiff.guessedPokemon === correctAnswer && <p>Congrats, {statDiff.guessedPokemon.toUpperCase()} was caught!</p>}
        {statDiff && statDiff.guessedPokemon !== correctAnswer && attemptNumber == 6 && <p>{correctAnswer.toUpperCase()} got away!</p>}
        {statDiff && statDiff.correctlyGuessedTypes.length == 0 && <p>Correct Type:</p>}
        {statDiff && statDiff.correctlyGuessedTypes.length == 1 && <p>Correct Type: {statDiff.correctlyGuessedTypes[0]}</p>}
        {statDiff && statDiff.correctlyGuessedTypes.length == 2 && <p>Correct Type: {statDiff.correctlyGuessedTypes[0]}, {statDiff.correctlyGuessedTypes[1]}</p>}
        {statDiff && statDiff.atkDiff > 0 && <p>Attack: too high</p>}
        {statDiff && statDiff.atkDiff < 0 && <p>Attack: too low</p>}
        {statDiff && statDiff.atkDiff == 0 && <p>Attack: correct</p>}
        {statDiff && statDiff.defDiff > 0 && <p>Defense: too high</p>}
        {statDiff && statDiff.defDiff < 0 && <p>Defense: too low</p>}
        {statDiff && statDiff.defDiff == 0 && <p>Defense: correct</p>}
        {statDiff && statDiff.htDiff > 0 && <p>Height: too high</p>}
        {statDiff && statDiff.htDiff < 0 && <p>Height: too low</p>}
        {statDiff && statDiff.htDiff == 0 && <p>Height: correct</p>}
        {statDiff && statDiff.wtDiff > 0 && <p>Weight: too high</p>}
        {statDiff && statDiff.wtDiff < 0 && <p>Weight: too low</p>}
        {statDiff && statDiff.wtDiff == 0 && <p>Weight: correct</p>}
        <p>Guesses: {attemptNumber}/6</p>
        {statDiff && statDiff.guessedPokemon === correctAnswer && <img src={image} width="500" height="600"></img>}
    </div>;
}

export default UserInput;