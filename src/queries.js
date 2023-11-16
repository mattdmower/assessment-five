import { Op } from 'sequelize';
import { Animal, Human } from './model.js';

// Get the human with the primary key 2
export const query1 = Human.findByPk(2);

// Get the first animal whose species is "fish"
export const query2 = Animal.findOne({ where: { species: 'fish' } });

// Get all animals belonging to the human with primary key 5
export const query3 = Animal.findAll({ where: { human_id: 5 } });

// Get all animals born in a year greater than (but not equal to) 2015.
export const query4 = Animal.findAll({ where: { birth_year: { [Op.gt]: 2015 } } });

// Get all the humans with first names that start with "J"
export const query5 = Human.findAll({ where: { fname: { [Op.like]: 'J%' } } });

// Get all the animals who don't have a birth year
export const query6 = Animal.findAll({ where: { birth_year: null } });

// Get all the animals with species "fish" OR "rabbit"
export const query7 = Animal.findAll({ where: { species: { [Op.or]: ['fish', 'rabbit'] } } });

// Get all the humans who DON'T have an email address that contains "gmail"
export const query8 = Human.findAll({ where: { email: { [Op.notLike]: '%gmail%' } } });

// Continue reading the instructions before you move on!

// Print a directory of humans and their animals
export async function printHumansAndAnimals() {
    try {
        // Fetch all humans including their associated animals
        const humansWithAnimals = await Human.findAll({
            include: [{
                model: Animal,
                as: 'animals' // Ensure this alias matches the one defined in your association
            }]
        });

        // Construct a directory of humans and their animals
        const directory = humansWithAnimals.map(human => {
            const animals = human.animals.map(animal => `${animal.name} (${animal.species})`).join(', ');
            return `${human.fname} ${human.lname}: ${animals}`;
        }).join('\n');

        // Return the directory
        return directory;
    } catch (error) {
        console.error('Error fetching humans and animals:', error);
        throw error; // Rethrow the error for further handling if necessary
    }
}


// Return a Set containing the full names of all humans
// with animals of the given species.
export async function getHumansByAnimalSpecies(species) {
    try {
        // Fetch humans who own animals of the specified species
        const humans = await Human.findAll({
            include: [{
                model: Animal,
                where: { species: species }
            }]
        });

        // Create a Set to store unique full names of humans
        const humanNames = new Set();

        // Add each human's full name to the Set
        humans.forEach(human => {
            humanNames.add(`${human.fname} ${human.lname}`);
        });

        // Return the Set of full names
        return humanNames;
    } catch (error) {
        console.error('Error fetching humans by animal species:', error);
        throw error; // Rethrow the error for further handling if necessary
    }
}
