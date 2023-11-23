import { Op } from 'sequelize';
import { Animal, Human } from './model.js';

// Get the human with the primary key 2
export const query1 = Human.findByPk(2)
    .then(human => {
        if (!human) return null;
        return {
            humanId: human.human_id,
            fname: human.fname,
            lname: human.lname,
            email: human.email
        };
    });

// Get the first animal whose species is "fish"
export const query2 = Animal.findOne({
    where: { species: 'fish' },
    attributes: ['animal_id', 'name', 'species', 'birth_year', 'human_id']
}).then(animal => {
    if (!animal) return null;
    return {
        animalId: animal.animal_id,
        name: animal.name,
        species: animal.species,
        birthYear: animal.birth_year,
        humanId: animal.human_id
    };
});

// Get all animals belonging to the human with primary key 5
export const query3 = Animal.findAll({ where: { human_id: 5 } });

// Get all animals born in a year greater than (but not equal to) 2015.
export const query4 = Animal.findAll({
    where: {
        birth_year: {
            [Op.gt]: 2015
        }
    },
    attributes: ['animal_id', 'name', 'species', 'birth_year', 'human_id']
}).then(animals => {
    return animals.map(animal => ({
        animalId: animal.animal_id,
        name: animal.name,
        species: animal.species,
        birthYear: animal.birth_year,
        humanId: animal.human_id
    }));
}).catch(error => {
    console.error('Error fetching animals born after 2015:', error);
    throw error;
});

// Get all the humans with first names that start with "J"
export const query5 = Human.findAll({ where: { fname: { [Op.like]: 'J%' } } });

// Get all the animals who don't have a birth year
export const query6 = Animal.findAll({
    where: {
        birth_year: null
    },
    attributes: ['animal_id', 'name', 'species', 'birth_year', 'human_id']
}).then(animals => {
    return animals.map(animal => ({
        animalId: animal.animal_id,
        name: animal.name,
        species: animal.species,
        birthYear: animal.birth_year,
        humanId: animal.human_id
    }));
}).catch(error => {
    console.error('Error fetching animals with no birth year:', error);
    throw error;
});


// Get all the animals with species "fish" OR "rabbit"
export const query7 = Animal.findAll({ where: { species: { [Op.or]: ['fish', 'rabbit'] } } });

// Get all the humans who DON'T have an email address that contains "gmail"
export const query8 = Human.findAll({ where: { email: { [Op.notLike]: '%gmail%' } } });

// Continue reading the instructions before you move on!

// Print a directory of humans and their animals
export async function printHumansAndAnimals() {
    try {
        const humans = await Human.findAll({
            include: [{
                model: Animal,
                required: false,
                attributes: ['name', 'species']
            }],
            order: [
                ['human_id', 'ASC'],
                [Animal, 'name', 'ASC']
            ]
        });
        for (const human of humans) {
            console.log(`${human.fname} ${human.lname}`);
            human.Animals.forEach(animal => {
                console.log(`- ${animal.name}, ${animal.species}`);
            });
        }
    } catch (error) {
        console.error('Error fetching humans and animals:', error);
    }
};

// Return a Set containing the full names of all humans
// with animals of the given species.
export async function getHumansByAnimalSpecies(species) {
    try {
        const humans = await Human.findAll({
            include: [{
                model: Animal,
                where: { species: species }
            }]
        });
        const humanNames = new Set();
        humans.forEach(human => {
            humanNames.add(`${human.fname} ${human.lname}`);
        });
        return humanNames;
    } catch (error) {
        console.error('Error fetching humans by animal species:', error);
        throw error;
    }
};